import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, ExternalLink, CheckCheck } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const JOTFORM_URL = 'https://www.jotform.com/253566966596075';
const CAMPUS_NAME = 'Michigan State University';

interface Member {
    id: string;
    email: string;
    full_name: string;
}

interface JotFormModalProps {
    open: boolean;
    onClose?: () => void;
}

/**
 * Modal for submitting weekly Jotforms for each member in the club.
 * Controls its own member/step/progress state, opens/closes via the open/onOpenChange props.
 */
export const JotFormModal = ({ open, onClose }: JotFormModalProps) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [completedMembers, setCompletedMembers] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            // Reset state and load members on modal open
            setCurrentIndex(0);
            setCompletedMembers(new Set());
            fetchMembers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            // Fetch all members (not prospects)
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, email, full_name')
                .not('email', 'is', null);

            if (profilesError) throw profilesError;

            // Get member roles
            const { data: roles, error: rolesError } = await supabase
                .from('user_roles')
                .select('user_id, role')
                .in('user_id', profiles.map(p => p.id))
                .neq('role', 'prospect');

            if (rolesError) throw rolesError;

            const memberIds = new Set(roles.map(r => r.user_id));
            const eligibleMembers = profiles.filter(p => memberIds.has(p.id));

            setMembers(eligibleMembers);
            //console.log(`Loaded ${eligibleMembers.length} eligible members`);
        } catch (error) {
            console.error('Error fetching members:', error);
            toast({
                title: 'Error',
                description: 'Failed to load members',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const currentMember = members[currentIndex];

    const generatePrefilledUrl = (member: Member) => {
        // Parse name
        const nameParts = member.full_name.trim().split(/\s+/);
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;

        // Calculate date (4 days ago)
        const fourDaysAgo = new Date();
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
        const month = String(fourDaysAgo.getMonth() + 1).padStart(2, '0');
        const day = String(fourDaysAgo.getDate()).padStart(2, '0');
        const year = String(fourDaysAgo.getFullYear());

        // Build pre-filled URL
        return (
            `${JOTFORM_URL}?` +
            `whatCbc%5Bmonth%5D=${month}&` +
            `whatCbc%5Bday%5D=${day}&` +
            `whatCbc%5Byear%5D=${year}&` +
            `whatIs=${encodeURIComponent(firstName)}&` +
            `typeA6=${encodeURIComponent(lastName)}&` +
            `whatIs7=${encodeURIComponent(member.email)}&` +
            `haveYou=Yes&` +
            `whatCampus=${encodeURIComponent(CAMPUS_NAME)}`
        );
    };

    const handleOpenForm = () => {
        if (!currentMember) return;
        const newCompleted = new Set(completedMembers);
        newCompleted.add(currentMember.id);
        setCompletedMembers(newCompleted);

        const url = generatePrefilledUrl(currentMember);
        window.open(url, 'jotform', 'width=800,height=900');
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < members.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const isFirstMember = currentIndex === 0;
    const isLastMember = currentIndex === members.length - 1;
    const isCurrentComplete = currentMember && completedMembers.has(currentMember.id);
    const progressPercent = members.length > 0 ? (completedMembers.size / members.length) * 100 : 0;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg rounded-md">
                <DialogHeader>
                    <DialogTitle>Weekly Jotform Submissions</DialogTitle>
                    <DialogDescription>
                        Submit member weekly check-in forms
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-8 text-center text-muted-foreground">
                        Loading members...
                    </div>
                ) : members.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        No eligible members found
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">
                                    {completedMembers.size} / {members.length} completed
                                </span>
                                <span className="text-muted-foreground">
                                    {Math.round(progressPercent)}%
                                </span>
                            </div>
                            <Progress value={progressPercent} />
                        </div>

                        {/* Current Member Card */}
                        {currentMember && (
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-semibold">
                                                {currentMember.full_name}
                                            </h3>
                                            {isCurrentComplete && (
                                                <CheckCheck className="h-5 w-5 text-green-600" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {currentMember.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Combined Actions & Navigation Horizontally */}
                                <div className="flex flex-row items-center gap-4 w-full">
                                    {/* Main Form Action */}
                                    <Button
                                        onClick={handleOpenForm}
                                        className="flex-1 gap-2"
                                        size="lg"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Open Pre-filled Form
                                    </Button>
                                    {/* Navigation Knobs Aligned Right */}
                                    <div className="flex flex-row items-center gap-2">
                                        <Button
                                            onClick={handlePrevious}
                                            disabled={isFirstMember}
                                            variant="default"
                                            size="icon"
                                            className="h-12 w-12 rounded-full disabled:bg-gray-200 disabled:text-gray-400"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            disabled={isLastMember}
                                            variant="default"
                                            size="icon"
                                            className="h-12 w-12 rounded-full disabled:bg-gray-200 disabled:text-gray-400"
                                        >
                                            <ChevronRight className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};