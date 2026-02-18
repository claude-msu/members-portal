import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { X, Plus } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { useIsMobile } from '@/hooks/use-mobile';
import type { MembershipInfo, Profile } from '@/types/modal.types';

interface MembersListModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    members: MembershipInfo[];
    entityType?: 'project' | 'class';
    entityId?: string;
    onMemberRemoved?: () => void;
    canRemoveMembers?: boolean;
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const getRoleVariant = (role: string): 'default' | 'secondary' => {
    if (role === 'lead' || role === 'teacher') return 'secondary';
    return 'default';
};

export const MembersListModal = ({
    open,
    onClose,
    title,
    subtitle,
    members,
    entityType,
    entityId,
    onMemberRemoved,
}: MembersListModalProps) => {
    const { toast } = useToast();
    const { isBoardOrAbove } = useProfile();
    const isMobile = useIsMobile();
    const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
    const [addMemberOpen, setAddMemberOpen] = useState(false);
    const [availableMembers, setAvailableMembers] = useState<Profile[]>([]);
    const [addingMemberId, setAddingMemberId] = useState<string | null>(null);
    const [locallyRemovedIds, setLocallyRemovedIds] = useState<Set<string>>(new Set());
    const [locallyAddedMembers, setLocallyAddedMembers] = useState<MembershipInfo[]>([]);
    const [memberRoles, setMemberRoles] = useState<Record<string, string>>({});

    const displayMembers = useMemo(
        () => [
            ...members.filter(m => !locallyRemovedIds.has(m.id)),
            ...locallyAddedMembers,
        ],
        [members, locallyRemovedIds, locallyAddedMembers]
    );
    const memberCount = displayMembers.length;
    const displaySubtitle = subtitle || `${memberCount} ${memberCount === 1 ? 'member' : 'members'}`;

    const showRemoveButton = isBoardOrAbove && entityType && entityId;

    useEffect(() => {
        if (!open) {
            setLocallyRemovedIds(new Set());
            setLocallyAddedMembers([]);
        }
    }, [open]);

    useEffect(() => {
        const fetchAvailableMembers = async () => {
            if (!open || !entityType || !entityId) return;

            try {
                const { data: allProfiles } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('is_banned', false)
                    .order('full_name');

                if (!allProfiles) return;

                const existingUserIds = displayMembers.map(m => m.user_id);
                const available = allProfiles.filter(p => !existingUserIds.includes(p.id));

                setAvailableMembers(available);
            } catch (error) {
                console.error('Error fetching available members:', error);
            }
        };

        fetchAvailableMembers();
    }, [open, entityType, entityId, displayMembers]);

    const handleRemoveMember = async (membershipId: string) => {
        if (!entityType || !entityId) return;

        setRemovingMemberId(membershipId);
        setLocallyRemovedIds(prev => new Set([...prev, membershipId]));

        try {
            const tableName = entityType === 'project' ? 'project_members' : 'class_enrollments';
            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq('id', membershipId);

            if (error) throw error;

            onMemberRemoved?.();
        } catch (error) {
            console.error('Error removing member:', error);
            setLocallyRemovedIds(prev => {
                const updated = new Set(prev);
                updated.delete(membershipId);
                return updated;
            });
            toast({
                title: 'Error',
                description: `Failed to remove member from ${entityType}.`,
                variant: 'destructive',
            });
        } finally {
            setRemovingMemberId(null);
        }
    };

    const handleAddMember = async (userId: string, memberName: string, profile: Profile) => {
        if (!entityType || !entityId) return;

        setAddingMemberId(userId);
        const defaultRole = entityType === 'project' ? 'member' : 'student';

        try {
            const tableName = entityType === 'project' ? 'project_members' : 'class_enrollments';

            const insertData = entityType === 'project'
                ? {
                    user_id: userId,
                    project_id: entityId,
                    role: defaultRole as 'member' | 'lead',
                }
                : {
                    user_id: userId,
                    class_id: entityId,
                    role: defaultRole as 'student' | 'teacher',
                };

            const { data: insertedData, error } = await supabase
                .from(tableName)
                .insert(insertData)
                .select();

            if (error) {
                if (error.code === '23505') {
                    toast({
                        title: 'Already Added',
                        description: `${memberName} is already in this ${entityType}.`,
                        variant: 'destructive',
                    });
                } else {
                    throw error;
                }
                return;
            }

            const newMembership: MembershipInfo = {
                id: insertedData?.[0]?.id || `temp-${userId}`,
                user_id: userId,
                role: defaultRole,
                profile,
            };

            setLocallyAddedMembers(prev => [...prev, newMembership]);
            setAddMemberOpen(false);
            onMemberRemoved?.();
        } catch (error) {
            console.error('Error adding member:', error);
            toast({
                title: 'Error',
                description: `Failed to add member to ${entityType}.`,
                variant: 'destructive',
            });
        } finally {
            setAddingMemberId(null);
        }
    };

    const getNextRole = (currentRole: string) => {
        if (entityType === 'project') {
            return currentRole === 'member' ? 'lead' : 'member';
        } else {
            return currentRole === 'student' ? 'teacher' : 'student';
        }
    };

    const handleRoleChange = async (memberId: string, currentRole: string) => {
        if (!entityType || !entityId) return;

        const nextRole = getNextRole(currentRole);

        try {
            const tableName = entityType === 'project' ? 'project_members' : 'class_enrollments';
            const { error } = await supabase
                .from(tableName)
                .update({ role: nextRole })
                .eq('id', memberId);

            if (error) throw error;

            setMemberRoles(prev => ({
                ...prev,
                [memberId]: nextRole,
            }));

            onMemberRemoved?.();
        } catch (error) {
            console.error('Error updating member role:', error);
            toast({
                title: 'Error',
                description: `Failed to update member role.`,
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className={`max-w-lg mx-auto rounded-lg ${isMobile ? 'w-[90vw] px-2' : 'w-[90vw]'}`}>


                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{displaySubtitle}</DialogDescription>
                </DialogHeader>

                {showRemoveButton && (
                    <div className="hidden md:block pb-3 border-b">
                        <Popover open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="default"
                                    className="w-full"
                                    disabled={availableMembers.length === 0}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Member
                                    {availableMembers.length === 0 && ' (All members added)'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-96 p-0"
                                align="center"
                                onOpenAutoFocus={e => e.preventDefault()}
                            >
                                <div
                                    className="p-1"
                                    style={{
                                        height: '300px',
                                        overflowY: 'scroll',
                                        overflowX: 'hidden',
                                        WebkitOverflowScrolling: 'touch',
                                    }}
                                    onWheel={e => e.stopPropagation()}
                                    onTouchMove={e => e.stopPropagation()}
                                >
                                    <Command>
                                        <CommandInput placeholder="Search members..." />
                                        <CommandList>
                                            <CommandEmpty>No members found.</CommandEmpty>
                                            <CommandGroup>
                                                {availableMembers.map((profile) => (
                                                    <CommandItem
                                                        key={profile.id}
                                                        value={`${profile.full_name || ''} ${profile.email}`}
                                                        onSelect={() => {
                                                            handleAddMember(
                                                                profile.id,
                                                                profile.full_name || profile.email,
                                                                profile
                                                            );
                                                        }}
                                                        disabled={addingMemberId === profile.id}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span>{profile.full_name || 'No name'}</span>
                                                            <span className="text-xs">{profile.email}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}

                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {displayMembers.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={member.profile.profile_picture_url || undefined} />
                                <AvatarFallback>
                                    {member.profile.full_name
                                        ? getInitials(member.profile.full_name)
                                        : member.profile.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                    {member.profile.full_name || 'No name'}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                    {member.profile.email}
                                </p>
                            </div>

                            <motion.div
                                animate={{ scale: 1, opacity: 1 }}
                                whileTap={{ scale: 0.93, opacity: 0.7 }}
                                className="cursor-pointer"
                                onClick={() =>
                                    isBoardOrAbove &&
                                    handleRoleChange(member.id, memberRoles[member.id] || member.role)
                                }
                            >
                                <Badge
                                    variant={getRoleVariant(memberRoles[member.id] || member.role)}
                                    className="capitalize"
                                >
                                    {memberRoles[member.id] || member.role}
                                </Badge>
                            </motion.div>

                            {showRemoveButton && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hidden md:flex h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleRemoveMember(member.id)}
                                    disabled={removingMemberId === member.id}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}

                    {displayMembers.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            No members yet
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};