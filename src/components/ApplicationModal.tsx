import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/database.types';

type ApplicationType = Database['public']['Enums']['application_type'];

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplicationModal = ({ open, onClose, onSuccess }: ApplicationModalProps) => {
  const { user, profile, role } = useAuth();
  const { toast } = useToast();
  const [applicationType, setApplicationType] = useState<ApplicationType | ''>('');
  const [loading, setLoading] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [classYear, setClassYear] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [whyJoin, setWhyJoin] = useState('');
  const [whyPosition, setWhyPosition] = useState('');
  const [relevantExperience, setRelevantExperience] = useState('');
  const [otherCommitments, setOtherCommitments] = useState('');
  const [projectDetail, setProjectDetail] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [previousExperience, setPreviousExperience] = useState('');

  useEffect(() => {
    if (profile && open) {
      setFullName(profile.full_name);
      setClassYear(profile.class_year || '');
    }
  }, [profile, open]);

  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user!.id}/${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('applications')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('applications')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !applicationType) return;

    setLoading(true);

    try {
      let resumeUrl = null;
      let transcriptUrl = null;

      if (resumeFile) {
        resumeUrl = await uploadFile(resumeFile, 'resumes');
      }

      if (transcriptFile) {
        transcriptUrl = await uploadFile(transcriptFile, 'transcripts');
      }

      const insertData: Database['public']['Tables']['applications']['Insert'] = {
        user_id: user.id,
        application_type: applicationType,
        full_name: fullName,
        class_year: classYear,
        status: 'pending',
        resume_url: resumeUrl,
        transcript_url: transcriptUrl,
        why_join: whyJoin || null,
        why_position: whyPosition || null,
        relevant_experience: relevantExperience || null,
        other_commitments: otherCommitments || null,
        project_detail: projectDetail || null,
        problem_solved: problemSolved || null,
        previous_experience: previousExperience || null,
      };

      const { error } = await supabase.from('applications').insert(insertData);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Application submitted successfully!',
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setApplicationType('');
    setWhyJoin('');
    setWhyPosition('');
    setRelevantExperience('');
    setOtherCommitments('');
    setProjectDetail('');
    setProblemSolved('');
    setPreviousExperience('');
    setResumeFile(null);
    setTranscriptFile(null);
  };

  const renderFields = () => {
    if (!applicationType) return null;

    const commonFields = (
      <>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="classYear">Class Year *</Label>
          <Select value={classYear} onValueChange={setClassYear} required>
            <SelectTrigger id="classYear">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freshman">Freshman</SelectItem>
              <SelectItem value="sophomore">Sophomore</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="graduate">Graduate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="resume">Resume</Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
          />
          {resumeFile && (
            <p className="text-xs text-muted-foreground">
              Selected: {resumeFile.name}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="transcript">Unofficial Transcript (PDF)</Label>
          <Input
            id="transcript"
            type="file"
            accept=".pdf"
            onChange={(e) => setTranscriptFile(e.target.files?.[0] || null)}
          />
          {transcriptFile && (
            <p className="text-xs text-muted-foreground">
              Selected: {transcriptFile.name}
            </p>
          )}
        </div>
      </>
    );

    switch (applicationType) {
      case 'club_admission':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="whyJoin">Why do you want to join? *</Label>
              <Textarea
                id="whyJoin"
                value={whyJoin}
                onChange={(e) => setWhyJoin(e.target.value)}
                required
                rows={4}
                placeholder="Tell us about your interest in Claude Builder Club..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relevantExperience">Relevant Experience</Label>
              <Textarea
                id="relevantExperience"
                value={relevantExperience}
                onChange={(e) => setRelevantExperience(e.target.value)}
                rows={3}
                placeholder="Any technical or club experience..."
              />
            </div>
          </>
        );

      case 'board':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="whyPosition">Why this position? *</Label>
              <Textarea
                id="whyPosition"
                value={whyPosition}
                onChange={(e) => setWhyPosition(e.target.value)}
                required
                rows={3}
                placeholder="What makes you a good fit for this board position?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relevantExperience">Relevant Experience *</Label>
              <Textarea
                id="relevantExperience"
                value={relevantExperience}
                onChange={(e) => setRelevantExperience(e.target.value)}
                required
                rows={3}
                placeholder="Leadership, organizational, or technical experience..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousExperience">Previous Board Experience</Label>
              <Textarea
                id="previousExperience"
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
                rows={3}
                placeholder="Any previous board or leadership roles..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherCommitments">Other Commitments *</Label>
              <Textarea
                id="otherCommitments"
                value={otherCommitments}
                onChange={(e) => setOtherCommitments(e.target.value)}
                required
                rows={2}
                placeholder="Classes, jobs, other clubs, etc."
              />
            </div>
          </>
        );

      case 'project':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="whyPosition">Why this project? *</Label>
              <Textarea
                id="whyPosition"
                value={whyPosition}
                onChange={(e) => setWhyPosition(e.target.value)}
                required
                rows={3}
                placeholder="What interests you about this project?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relevantExperience">Relevant Technical Skills *</Label>
              <Textarea
                id="relevantExperience"
                value={relevantExperience}
                onChange={(e) => setRelevantExperience(e.target.value)}
                required
                rows={3}
                placeholder="Programming languages, frameworks, tools, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDetail">Describe one project in detail *</Label>
              <Textarea
                id="projectDetail"
                value={projectDetail}
                onChange={(e) => setProjectDetail(e.target.value)}
                required
                rows={4}
                placeholder="What did you build? What technologies did you use? What was your role?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problemSolved">Describe a technical challenge you overcame *</Label>
              <Textarea
                id="problemSolved"
                value={problemSolved}
                onChange={(e) => setProblemSolved(e.target.value)}
                required
                rows={4}
                placeholder="What was the problem? How did you solve it?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherCommitments">Other Commitments *</Label>
              <Textarea
                id="otherCommitments"
                value={otherCommitments}
                onChange={(e) => setOtherCommitments(e.target.value)}
                required
                rows={2}
                placeholder="Classes, jobs, other clubs, etc."
              />
            </div>
          </>
        );

      case 'class':
        return (
          <>
            {commonFields}
            <div className="space-y-2">
              <Label htmlFor="whyPosition">Why this class? *</Label>
              <Textarea
                id="whyPosition"
                value={whyPosition}
                onChange={(e) => setWhyPosition(e.target.value)}
                required
                rows={3}
                placeholder="What do you hope to learn from this class?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousExperience">Previous experience in this topic *</Label>
              <Textarea
                id="previousExperience"
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
                required
                rows={3}
                placeholder="Any prior knowledge, courses, or projects related to this topic..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relevantExperience">What will you bring to the class?</Label>
              <Textarea
                id="relevantExperience"
                value={relevantExperience}
                onChange={(e) => setRelevantExperience(e.target.value)}
                rows={3}
                placeholder="Skills, perspectives, or experiences you'll contribute..."
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Application</DialogTitle>
          <DialogDescription>
            Submit your application to Claude Builder Club
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="applicationType">Application Type *</Label>
            <Select
              value={applicationType}
              onValueChange={(value) => setApplicationType(value as ApplicationType)}
            >
              <SelectTrigger id="applicationType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {role === 'prospect' && (
                  <SelectItem value="club_admission">Club Admission</SelectItem>
                )}
                {role !== 'prospect' && (
                  <>
                    <SelectItem value="board">Board Position</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="class">Class</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {renderFields()}

          {applicationType && (
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};