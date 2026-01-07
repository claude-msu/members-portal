import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, FolderKanban, GraduationCap, Award } from 'lucide-react';
import type { Database } from '@/integrations/supabase/database.types';

type Event = Database['public']['Tables']['events']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Class = Database['public']['Tables']['classes']['Row'];

const Dashboard = () => {
  const { user, profile, role } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [userClasses, setUserClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && role) {
      fetchDashboardData();
    }
  }, [user, role]);

  const fetchDashboardData = async () => {
    if (!user || !role) return;

    // Fetch upcoming events (next 5 events user is allowed to see)
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .contains('allowed_roles', [role])
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
      .limit(5);

    if (eventsData) setUpcomingEvents(eventsData);

    // Fetch user's projects
    const { data: projectMemberships } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', user.id);

    if (projectMemberships && projectMemberships.length > 0) {
      const projectIds = projectMemberships.map(pm => pm.project_id);
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .in('id', projectIds)
        .order('created_at', { ascending: false });

      if (projectsData) setUserProjects(projectsData);
    }

    // Fetch user's classes
    const { data: classEnrollments } = await supabase
      .from('class_enrollments')
      .select('class_id')
      .eq('user_id', user.id);

    if (classEnrollments && classEnrollments.length > 0) {
      const classIds = classEnrollments.map(ce => ce.class_id);
      const { data: classesData } = await supabase
        .from('classes')
        .select('*')
        .in('id', classIds)
        .order('name', { ascending: true });

      if (classesData) setUserClasses(classesData);
    }

    setLoading(false);
  };

  const getRoleBadgeColor = (roleValue: string) => {
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.full_name || 'User'}!
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-muted-foreground">Claude Builder Club @ MSU</p>
          {role && (
            <Badge variant={getRoleBadgeColor(role)} className="capitalize">
              {role.replace('-', ' ')}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.points || 0}</div>
            <p className="text-xs text-muted-foreground">Total club points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProjects.length}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userClasses.length}</div>
            <p className="text-xs text-muted-foreground">Enrolled classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {role?.replace('-', ' ') || 'Prospect'}
            </div>
            <p className="text-xs text-muted-foreground">Club status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Next club events</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex justify-between items-start border-b pb-2 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.event_date).toLocaleDateString()} at {event.location}
                      </p>
                    </div>
                    {event.points > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        +{event.points} pts
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Your Projects</CardTitle>
                <CardDescription>Active projects</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : userProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active projects</p>
            ) : (
              <div className="space-y-3">
                {userProjects.map((project) => (
                  <div key={project.id} className="border-b pb-2 last:border-0">
                    <p className="font-medium text-sm">{project.name}</p>
                    {project.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {project.description}
                      </p>
                    )}
                    {project.due_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {new Date(project.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Your Classes</CardTitle>
              <CardDescription>Currently enrolled</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : userClasses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Not enrolled in any classes</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {userClasses.map((cls) => (
                <div key={cls.id} className="border rounded-lg p-3">
                  <p className="font-medium text-sm">{cls.name}</p>
                  {cls.schedule && (
                    <p className="text-xs text-muted-foreground mt-1">{cls.schedule}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;