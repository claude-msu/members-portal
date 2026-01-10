import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Mail, GraduationCap, ArrowBigUpDashIcon, Eye, Settings, Ban } from 'lucide-react';
import type { Database } from '@/integrations/supabase/database.types';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileViewer from '@/components/modals/ProfileModal';

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface ProspectWithRole extends Profile {
  role: AppRole;
}

const Prospects = () => {
  const { toast } = useToast();
  const { role: userRole, user } = useAuth();
  const [prospects, setProspects] = useState<ProspectWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProspect, setSelectedProspect] = useState<ProspectWithRole | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    // Fetch all profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      setLoading(false);
      return;
    }

    if (!profilesData) {
      setLoading(false);
      return;
    }

    // Fetch all user roles
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('user_id, role');

    // Create a map of user_id to role
    const roleMap = new Map(
      rolesData?.map(r => [r.user_id, r.role]) || []
    );

    // Combine profiles with roles, only include prospects
    const prospectsWithRoles: ProspectWithRole[] = profilesData
      .map(profile => ({
        ...profile,
        role: roleMap.get(profile.id) || 'prospect',
      }))
      .filter(member => member.role === 'prospect');

    setProspects(prospectsWithRoles);
    setLoading(false);
  };

  const handleGraduate = async (prospectId: string, prospectName: string) => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: 'member' })
      .eq('user_id', prospectId);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `${prospectName} graduated to Member successfully`,
      });
      fetchProspects();
    }
  };

  const handleBanProspect = async (prospectId: string, prospectName: string) => {
    try {
      // First, get the prospect's email for the ban record
      const { data: prospect, error: fetchError } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', prospectId)
        .single();

      if (fetchError) throw fetchError;

      // Add to banned_users table
      const { error: banError } = await supabase
        .from('banned_users')
        .insert({
          user_id: prospectId,
          email: prospect.email,
          full_name: prospect.full_name,
          banned_by: user?.id,
          reason: 'Banned by e-board'
        });

      if (banError) throw banError;

      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', prospectId);

      if (deleteError) throw deleteError;

      toast({
        title: 'Prospect Banned',
        description: `${prospectName} has been banned for one year`,
        variant: 'destructive',
      });
      fetchProspects();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to ban prospect',
        variant: 'destructive',
      });
    }
  };


  const handleViewProfile = (prospect: ProspectWithRole) => {
    setSelectedProspect(prospect);
    setIsProfileModalOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const canManageProspects = userRole === 'board' || userRole === 'e-board';

  if (loading) {
    return (
      <div className="p-6">
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>Prospects</h1>
          <p className="text-muted-foreground">Manage prospective members</p>
        </div>
        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading prospects...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>Prospects</h1>
        <p className="text-muted-foreground">
          {prospects.length} {prospects.length === 1 ? 'prospect' : 'prospects'}
        </p>
      </div>

      {prospects.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No prospects at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,400px))] mt-6">
          {prospects.map((prospect) => (
            <Card key={prospect.id} className="flex flex-col h-full w-full relative">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={prospect.profile_picture_url || undefined} />
                      <AvatarFallback className="text-lg">
                        {prospect.full_name ? getInitials(prospect.full_name) : prospect.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {prospect.full_name || 'No name'}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Mail className="h-3 w-3 shrink-0" />
                        <p className="truncate">{prospect.email}</p>
                      </div>
                    </div>
                  </CardTitle>
                  <Badge variant="outline" className="capitalize shrink-0 whitespace-nowrap">
                    Prospect
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 space-y-3 mt-3">
                  <div className="flex items-center justify-between text-sm">
                    {prospect.class_year ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span className="capitalize">{prospect.class_year}</span>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        <GraduationCap className="h-4 w-4 inline mr-2" />
                        No class year
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      <span className="font-medium">{prospect.points}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-2 mt-4">
                  <Button
                    variant='default'
                    size="sm"
                    className="w-full"
                    onClick={() => handleViewProfile(prospect)}
                  >
                    <Eye className="h-4 w-4" />
                    View Profile
                  </Button>
                  {canManageProspects && !isMobile && (
                    <DropdownMenu>
                      <DropdownMenuTrigger size='sm' asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Settings className="h-4 w-4" />
                          Manage
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className="w-40"
                      >
                        <DropdownMenuItem
                          onClick={() => handleGraduate(prospect.id, prospect.full_name || prospect.email)}
                        >
                          <ArrowBigUpDashIcon className="h-4 w-4" />
                          Graduate
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleBanProspect(prospect.id, prospect.full_name || prospect.email)}
                          variant='destructive'
                        >
                          <Ban className="h-4 w-4" />
                          Ban Prospect
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Profile Viewer */}
      <ProfileViewer
        open={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedProspect(null);
        }}
        member={selectedProspect}
      />
    </div>
  );
};

export default Prospects;