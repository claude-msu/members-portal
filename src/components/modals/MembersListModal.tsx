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
import { GraduationCap, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import type { MembershipInfo } from '@/types/modal.types';

interface MembersListModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    members: MembershipInfo[];
    showRole?: boolean;
    roleIcon?: (role: string) => React.ReactNode;
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
    if (role === 'lead' || role === 'teacher') return 'default';
    return 'secondary';
};

const defaultRoleIcon = (role: string) => {
    if (role === 'teacher') {
        return <GraduationCap className="h-3 w-3 mr-1" />;
    }
    return null;
};

export const MembersListModal = ({
    open,
    onClose,
    title,
    subtitle,
    members,
    showRole = true,
    roleIcon = defaultRoleIcon,
    entityType,
    entityId,
    onMemberRemoved,
}: MembersListModalProps) => {
    const memberCount = members.length;
    const displaySubtitle = subtitle || `${memberCount} ${memberCount === 1 ? 'member' : 'members'}`;
    const { toast } = useToast();
    const { isBoardOrAbove } = useProfile();
    const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

    const showRemoveButton = isBoardOrAbove && entityType && entityId;

    const handleRemoveMember = async (membershipId: string, memberName: string) => {
        if (!entityType || !entityId) return;

        setRemovingMemberId(membershipId);
        try {
            const tableName = entityType === 'project' ? 'project_members' : 'class_enrollments';
            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq('id', membershipId);

            if (error) throw error;

            toast({
                title: 'Member removed',
                description: `${memberName} has been removed from the ${entityType}.`,
            });

            onMemberRemoved?.();
        } catch (error) {
            console.error('Error removing member:', error);
            toast({
                title: 'Error',
                description: `Failed to remove member from ${entityType}.`,
                variant: 'destructive',
            });
        } finally {
            setRemovingMemberId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-[80vw] mx-auto rounded-lg">

                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{displaySubtitle}</DialogDescription>
                </DialogHeader>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {members.map((member) => (
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

                            {showRole && (
                                <Badge variant={getRoleVariant(member.role)} className="capitalize">
                                    {roleIcon(member.role)}
                                    {member.role}
                                </Badge>
                            )}

                            {showRemoveButton && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleRemoveMember(member.id, member.profile.full_name || member.profile.email)}
                                    disabled={removingMemberId === member.id}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}

                    {members.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            No members yet
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};