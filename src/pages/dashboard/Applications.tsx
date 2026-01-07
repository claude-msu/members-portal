import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { ApplicationModal } from '@/components/ApplicationModal';
import type { Database } from '@/integrations/supabase/database.types';

type Application = Database['public']['Tables']['applications']['Row'];

const Applications = () => {
  const { user, role } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && role) {
      fetchApplications();
    }
  }, [user, role]);

  const fetchApplications = async () => {
    if (!user) return;

    let query = supabase.from('applications').select('*');

    // Board and e-board can see all applications
    const canSeeAll = role === 'board' || role === 'e-board';
    if (!canSeeAll) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data) {
      setApplications(data);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatApplicationType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">Submit and track your applications</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading applications...</p>
          </CardContent>
        </Card>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No applications yet. Click "New Application" to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      {formatApplicationType(app.application_type)}
                    </CardTitle>
                    <CardDescription>
                      Submitted {new Date(app.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(app.status)} className="capitalize">
                    {app.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <ApplicationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchApplications}
      />
    </div>
  );
};

export default Applications;