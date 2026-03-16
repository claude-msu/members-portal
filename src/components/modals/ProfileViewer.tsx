import { RoleBadge } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Trophy, Mail, GraduationCap, Crown, Users, Award, Linkedin, Github, Briefcase, BookOpen, Copy, Check } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/database.types';
import type { AppRole } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface MemberWithRole extends Profile {
  role: AppRole;
}

interface ProfileViewerProps {
  open?: boolean;
  onClose?: () => void;
  member: MemberWithRole | null;
  embedded?: boolean;
  className?: string;
}

interface InvolvementBadge {
  id: string;
  type: 'project' | 'class';
  role: string;
  semesterCode: string;
  name: string;
}

const ProfileViewer = ({ open = false, onClose, member, embedded = false, className = '' }: ProfileViewerProps) => {
  const [involvementBadges, setInvolvementBadges] = useState<InvolvementBadge[]>([]);
  const [emailCopied, setEmailCopied] = useState(false);
  const isMobile = useIsMobile();

  const copyEmail = useCallback(async () => {
    if (!member?.email) return;
    try {
      await navigator.clipboard.writeText(member.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = member.email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  }, [member?.email]);


  const fetchInvolvement = useCallback(async () => {
    if (!member?.id) return;

    try {
      const badges: InvolvementBadge[] = [];

      // Fetch project memberships with project and semester data
      const { data: projectMemberships, error: projectError } = await supabase
        .from('project_members')
        .select(`
          id,
          role,
          projects (
            name,
            semesters (code)
          )
        `)
        .eq('user_id', member.id);

      if (projectError) {
        console.error('Error fetching project memberships:', projectError);
      }

      if (projectMemberships) {
        for (const membership of projectMemberships) {
          const project = membership.projects;
          if (project?.name && project?.semesters?.code) {
            badges.push({
              id: membership.id,
              type: 'project',
              role: membership.role === 'lead' ? 'Lead' : 'Member',
              semesterCode: project.semesters.code,
              name: project.name,
            });
          }
        }
      }

      // Fetch class enrollments with class and semester data
      const { data: classEnrollments, error: classError } = await supabase
        .from('class_enrollments')
        .select(`
          id,
          role,
          classes (
            name,
            semesters (code)
          )
        `)
        .eq('user_id', member.id);

      if (classError) {
        console.error('Error fetching class enrollments:', classError);
      }

      if (classEnrollments) {
        for (const enrollment of classEnrollments) {
          const classData = enrollment.classes;
          if (classData?.name && classData?.semesters?.code) {
            badges.push({
              id: enrollment.id,
              type: 'class',
              role: enrollment.role === 'teacher' ? 'Teacher' : 'Student',
              semesterCode: classData.semesters.code,
              name: classData.name,
            });
          }
        }
      }

      setInvolvementBadges(badges);
    } catch (error) {
      console.error('Error fetching involvement:', error);
    }
  }, [member?.id]);

  useEffect(() => {
    if (member?.id) {
      fetchInvolvement();
    }
  }, [member?.id, fetchInvolvement]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'e-board':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'board':
        return <Award className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-green-500" />;
    }
  };

  const profileContent = member && (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={member.profile_picture_url || undefined} />
          <AvatarFallback className="text-2xl">
            {member.full_name
              ? getInitials(member.full_name)
              : member.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">
            {member.full_name || 'No name'}
          </h3>
          <div className="flex items-center justify-center gap-2">
            {getRoleIcon(member.role)}
            <RoleBadge role={member.role} className="capitalize" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Profile Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <button
            type="button"
            className="flex items-center gap-2 rounded-[0.3rem] sm:rounded-[0.375rem] px-1 py-0.5 -ml-1 hover:bg-muted/60 transition-colors cursor-pointer group w-fit"
            onClick={copyEmail}
          >
            <span className="relative inline-flex shrink-0 items-center justify-center text-muted-foreground">
              {emailCopied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <span className="inline-flex items-center justify-center h-4 w-4 transition-colors duration-400">
                  <Mail
                    className="absolute inset-0 h-4 w-4 transition-opacity duration-400 pointer-events-none group-hover:opacity-0 group-hover:aria-hidden:true"
                  />
                  <Copy
                    className="absolute inset-0 h-4 w-4 transition-opacity duration-400 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:aria-hidden:false"
                  />
                </span>
              )}
            </span>
            <p className="text-sm">{member.email}</p>
          </button>
        </div>

        {member.class_year && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Class Year</p>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm capitalize">{member.class_year}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Club Points</p>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <p className="text-sm font-semibold">{member.points} points</p>
          </div>
        </div>

        {member.position && (
          <div className="flex justify-between gap-4">
            {member.position && (
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium text-muted-foreground">Position</p>
                <p className="text-sm">{member.position}</p>
              </div>
            )}
          </div>
        )}

        {(member.linkedin_username || member.github_username) && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Social Links</p>
              <div className="flex flex-col gap-2">
                {member.linkedin_username && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(`https://linkedin.com/in/${member.linkedin_username}`, '_blank')}
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                    View LinkedIn Profile
                  </Button>
                )}
                {member.github_username && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(`https://github.com/${member.github_username}`, '_blank')}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    View GitHub Profile
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {!isMobile && involvementBadges.length > 0 && (
          <>
            <Separator />
            <motion.div
              className="relative rounded-md overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <motion.div
                className="relative"
                initial={{ y: -24 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.45, ease: 'easeInOut', delay: 0.04 }}
              >
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Involvement</p>
                  <div className="flex flex-wrap gap-2">
                    {involvementBadges.map((badge) => (
                      <Tooltip key={badge.id}>
                        <TooltipTrigger asChild>
                          <span className="inline-block">
                            <Badge
                              variant="secondary"
                              className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 hover:bg-secondary/80 transition-colors"
                            >
                              {badge.type === 'project' ? (
                                <Briefcase className="h-3 w-3" />
                              ) : (
                                <BookOpen className="h-3 w-3" />
                              )}
                              <span>
                                {badge.role} {badge.semesterCode}
                              </span>
                            </Badge>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center" className="max-w-xs">
                          <p className="text-sm">{badge.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );

  // If embedded mode, return content directly without Dialog wrapper
  if (embedded) {
    return (
      <div className={`bg-card border rounded-lg shadow-sm overflow-hidden ${className}`}>
        <div className="p-6">
          {profileContent}
        </div>
      </div>
    );
  }

  // Otherwise, return as modal (onOpenChange receives new open state; only call onClose when closing)
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
      <DialogContent className="max-w-lg w-[95vw] mx-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>Member Profile</DialogTitle>
          <DialogDescription>View member details</DialogDescription>
        </DialogHeader>
        {profileContent}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileViewer;