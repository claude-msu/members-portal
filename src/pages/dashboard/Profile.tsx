import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Mail, Award, Upload } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/database.types';

const Profile = () => {
  const { user, profile, role, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [classYear, setClassYear] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setClassYear(profile.class_year || '');
      setLinkedinUrl(profile.linkedin_url || '');
      setProfilePictureUrl(profile.profile_picture_url || '');
      setResumeUrl(profile.resume_url || '');
    }
  }, [profile]);

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${user!.id}/${fileName}`;

    // Delete old files in this folder
    const { data: existingFiles } = await supabase.storage
      .from(bucket)
      .list(`${folder}/${user!.id}`);

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map(file => `${folder}/${user!.id}/${file.name}`);
      await supabase.storage.from(bucket).remove(filesToDelete);
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newProfilePictureUrl = profilePictureUrl;
      let newResumeUrl = resumeUrl;

      if (profilePictureFile) {
        newProfilePictureUrl = await uploadFile(profilePictureFile, 'profiles', 'avatars');
      }

      if (resumeFile) {
        newResumeUrl = await uploadFile(resumeFile, 'profiles', 'resumes');
      }

      const updateData: Database['public']['Tables']['profiles']['Update'] = {
        full_name: fullName,
        class_year: classYear || null,
        linkedin_url: linkedinUrl || null,
        profile_picture_url: newProfilePictureUrl || null,
        resume_url: newResumeUrl || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user!.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });

      // Refresh profile in AuthContext
      await refreshProfile();

      // Clear file inputs
      setProfilePictureFile(null);
      setResumeFile(null);
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

  const getRoleBadgeVariant = (roleValue: string) => {
    switch (roleValue) {
      case 'e-board':
        return 'default';
      case 'board':
        return 'secondary';
      case 'member':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user || !profile) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>Your club information</CardDescription>
            </div>
            {role && (
              <Badge variant={getRoleBadgeVariant(role)} className="capitalize">
                {role.replace('-', ' ')}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profilePictureUrl} />
                <AvatarFallback className="text-lg">
                  {fullName ? getInitials(fullName) : user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{fullName || 'No name set'}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span className="text-2xl font-bold">{profile.points}</span>
                </div>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span className="text-2xl font-bold capitalize">
                    {role?.replace('-', ' ') || 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Role</p>
              </div>
            </div>
          </div>

          {resumeUrl && (
            <div className="mt-4 pt-4 border-t">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                View Current Resume
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profilePicture">Profile Picture</Label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePictureFile(e.target.files?.[0] || null)}
              />
              {profilePictureFile && (
                <p className="text-xs text-muted-foreground">
                  Selected: {profilePictureFile.name}
                </p>
              )}
            </div>

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
              <Label htmlFor="classYear">Class Year</Label>
              <Select value={classYear} onValueChange={setClassYear}>
                <SelectTrigger>
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
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Resume (PDF, DOC, or DOCX)</Label>
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
              <p className="text-xs text-muted-foreground">
                Uploading a new resume will replace the previous one
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;