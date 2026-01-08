import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, ExternalLink, Calendar, GraduationCap, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/database.types';

type Application = Database['public']['Tables']['applications']['Row'];

interface ApplicationViewerProps {
    application: Application | null;
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export const ApplicationViewer = ({ application, open, onClose, onUpdate }: ApplicationViewerProps) => {
    const { toast } = useToast();
    const [actionLoading, setActionLoading] = useState(false);
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    if (!application) return null;

    const handleAccept = async () => {
        setActionLoading(true);
        try {
            const { error } = await supabase
                .from('applications')
                .update({ status: 'accepted' })
                .eq('id', application.id);

            if (error) throw error;

            toast({
                title: 'Application Accepted',
                description: `${application.full_name}'s application has been accepted.`,
            });

            setShowAcceptDialog(false);
            onUpdate();
            onClose();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        setActionLoading(true);
        try {
            const { error } = await supabase
                .from('applications')
                .update({ status: 'rejected' })
                .eq('id', application.id);

            if (error) throw error;

            toast({
                title: 'Application Rejected',
                description: `${application.full_name}'s application has been rejected.`,
            });

            setShowRejectDialog(false);
            onUpdate();
            onClose();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const formatApplicationType = (type: string) => {
        return type
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'accepted':
                return <Badge variant="default" className="bg-green-500">Accepted</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="secondary">Pending</Badge>;
        }
    };

    const handleOpenDocument = async (filePath: string) => {
        try {
            const { data, error } = await supabase.storage
                .from('applications')
                .createSignedUrl(filePath, 3600); // 3600 seconds = 1 hour

            if (error) throw error;
            if (!data?.signedUrl) throw new Error('Failed to generate signed URL');

            window.open(data.signedUrl, '_blank');
        } catch (error: any) {
            console.error('Error opening document:', error);
            toast({
                title: 'Error',
                description: 'Failed to open document. You may not have permission.',
                variant: 'destructive',
            });
        }
    };

    const renderApplicationFields = () => {
        switch (application.application_type) {
            case 'club_admission':
                return (
                    <>
                        {application.why_join && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Why do you want to join?</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.why_join}
                                </p>
                            </div>
                        )}
                        {application.relevant_experience && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Relevant Experience</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.relevant_experience}
                                </p>
                            </div>
                        )}
                    </>
                );

            case 'board':
                return (
                    <>
                        {application.why_position && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Why this position?</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.why_position}
                                </p>
                            </div>
                        )}
                        {application.relevant_experience && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Relevant Experience</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.relevant_experience}
                                </p>
                            </div>
                        )}
                        {application.previous_experience && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Previous Board Experience</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.previous_experience}
                                </p>
                            </div>
                        )}
                        {application.other_commitments && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Other Commitments</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.other_commitments}
                                </p>
                            </div>
                        )}
                    </>
                );

            case 'project':
                return (
                    <>
                        {application.why_position && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Why this project?</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.why_position}
                                </p>
                            </div>
                        )}
                        {application.relevant_experience && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Relevant Technical Skills</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.relevant_experience}
                                </p>
                            </div>
                        )}
                        {application.project_detail && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Project Detail</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.project_detail}
                                </p>
                            </div>
                        )}
                        {application.problem_solved && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Technical Challenge Overcome</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.problem_solved}
                                </p>
                            </div>
                        )}
                        {application.other_commitments && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Other Commitments</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.other_commitments}
                                </p>
                            </div>
                        )}
                    </>
                );

            case 'class':
                return (
                    <>
                        {application.why_position && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Why this class?</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.why_position}
                                </p>
                            </div>
                        )}
                        {application.previous_experience && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Previous Experience</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.previous_experience}
                                </p>
                            </div>
                        )}
                        {application.relevant_experience && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">What will you bring?</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.relevant_experience}
                                </p>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{application.full_name}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{formatApplicationType(application.application_type)}</Badge>
                            {getStatusBadge(application.status)}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Class Year</p>
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium capitalize">{application.class_year}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Submitted</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">
                                        {format(new Date(application.created_at), 'MMM d, yyyy')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Application Responses */}
                        <div className="space-y-4">
                            {renderApplicationFields()}
                        </div>

                        {/* Documents */}
                        {(application.resume_url || application.transcript_url) && (
                            <>
                                <Separator />
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Documents
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {application.resume_url && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenDocument(application.resume_url!)}
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                View Resume
                                            </Button>
                                        )}
                                        {application.transcript_url && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenDocument(application.transcript_url!)}
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                View Transcript
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Action Buttons - Only show for pending applications */}
                        {application.status === 'pending' && (
                            <>
                                <Separator />
                                <div className="flex gap-3">
                                    <Button
                                        variant="default"
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        onClick={() => setShowAcceptDialog(true)}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Accept
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => setShowRejectDialog(true)}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Accept Confirmation Dialog */}
            <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Accept Application?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to accept {application.full_name}'s application for{' '}
                            {formatApplicationType(application.application_type)}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleAccept}
                            disabled={actionLoading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {actionLoading ? 'Accepting...' : 'Yes, Accept'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Confirmation Dialog */}
            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Application?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject {application.full_name}'s application for{' '}
                            {formatApplicationType(application.application_type)}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReject}
                            disabled={actionLoading}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {actionLoading ? 'Rejecting...' : 'Yes, Reject'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};