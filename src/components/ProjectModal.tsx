import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/database.types';

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Profile = Database['public']['Tables']['profiles']['Row'];

export const ProjectModal = ({ open, onClose, onSuccess }: ProjectModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Profile[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    client_name: '',
    description: '',
    github_url: '',
    due_date: '',
    lead_id: '',
  });

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open]);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });

    if (data) {
      setMembers(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Create the project
      const projectInsert: Database['public']['Tables']['projects']['Insert'] = {
        name: formData.name,
        client_name: formData.client_name || null,
        description: formData.description || null,
        github_url: formData.github_url,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        lead_id: formData.lead_id || null,
        created_by: user.id,
      };

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectInsert)
        .select()
        .single();

      if (projectError) throw projectError;

      if (!project) throw new Error('Project creation failed');

      // Automatically add the project lead as a member with 'lead' role
      if (formData.lead_id) {
        const { error: memberError } = await supabase
          .from('project_members')
          .insert({
            user_id: formData.lead_id,
            project_id: project.id,
            role: 'lead',
          });

        if (memberError) {
          console.error('Error adding lead as member:', memberError);
          // Don't throw - project was created successfully
        }
      }

      toast({
        title: 'Success',
        description: 'Project created successfully',
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
    setFormData({
      name: '',
      client_name: '',
      description: '',
      github_url: '',
      due_date: '',
      lead_id: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Add a new project to Claude Builder Club
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Awesome Project"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_name">Client Name</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              placeholder="Optional - leave blank for internal projects"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="What is this project about? What will you build?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub Repository URL *</Label>
            <Input
              id="github_url"
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/organization/repo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead_id">Project Lead</Label>
            <Select
              value={formData.lead_id}
              onValueChange={(value) => setFormData({ ...formData, lead_id: value })}
            >
              <SelectTrigger id="lead_id">
                <SelectValue placeholder="Select a project lead (optional)" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.full_name || member.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The project lead will automatically be added as a team member
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};