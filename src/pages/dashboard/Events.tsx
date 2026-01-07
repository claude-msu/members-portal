import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, Users, Trophy, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { EventModal } from '@/components/EventModal';
import type { Database } from '@/integrations/supabase/database.types';

type Event = Database['public']['Tables']['events']['Row'];
type EventAttendance = Database['public']['Tables']['event_attendance']['Row'];

interface EventWithAttendance extends Event {
  userAttendance?: EventAttendance;
  attendanceCount: number;
}

const Events = () => {
  const { user, role } = useAuth();
  const [events, setEvents] = useState<EventWithAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && role) {
      fetchEvents();
    }
  }, [user, role]);

  const fetchEvents = async () => {
    if (!user || !role) return;

    // Fetch events that the user's role is allowed to see
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .contains('allowed_roles', [role])
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      setLoading(false);
      return;
    }

    if (!eventsData) {
      setLoading(false);
      return;
    }

    // Fetch user's attendance records
    const { data: attendanceData } = await supabase
      .from('event_attendance')
      .select('*')
      .eq('user_id', user.id);

    const attendanceMap = new Map(
      attendanceData?.map(a => [a.event_id, a]) || []
    );

    // Fetch attendance counts for each event
    const eventsWithData = await Promise.all(
      eventsData.map(async (event) => {
        const { count } = await supabase
          .from('event_attendance')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id);

        return {
          ...event,
          userAttendance: attendanceMap.get(event.id),
          attendanceCount: count || 0,
        };
      })
    );

    setEvents(eventsWithData);
    setLoading(false);
  };

  const handleRSVP = async (eventId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('event_attendance')
      .insert({
        user_id: user.id,
        event_id: eventId,
        attended: false,
      });

    if (error) {
      console.error('Error RSVPing to event:', error);
      return;
    }

    fetchEvents();
  };

  const handleCancelRSVP = async (eventId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('event_attendance')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId);

    if (error) {
      console.error('Error canceling RSVP:', error);
      return;
    }

    fetchEvents();
  };

  const canManageEvents = role === 'board' || role === 'e-board';

  const isEventFull = (event: EventWithAttendance) => {
    return event.rsvp_required && event.attendanceCount >= event.max_attendance;
  };

  const getEventTypeLabel = (event: Event) => {
    // Check if it's open to all roles
    const allRoles: Database['public']['Enums']['app_role'][] = ['prospect', 'member', 'board', 'e-board'];
    const isOpen = allRoles.every(r => event.allowed_roles.includes(r));
    return isOpen ? 'Open Meeting' : 'Closed Meeting';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Upcoming club events</p>
        </div>
        {canManageEvents && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading events...</p>
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No upcoming events at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const isFull = isEventFull(event);
            const hasRSVPed = !!event.userAttendance;
            const hasAttended = event.userAttendance?.attended || false;

            return (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>{event.name}</CardTitle>
                    <Badge variant={event.rsvp_required ? 'default' : 'secondary'}>
                      {getEventTypeLabel(event)}
                    </Badge>
                  </div>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(event.event_date), 'PPP p')}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    {event.points > 0 && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Trophy className="h-4 w-4" />
                        +{event.points} points
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}

                  {event.rsvp_required && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {event.attendanceCount} / {event.max_attendance} RSVPs
                      </div>
                      {isFull && !hasRSVPed && (
                        <Badge variant="destructive">Full</Badge>
                      )}
                    </div>
                  )}

                  {hasRSVPed && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <CheckCircle className="h-4 w-4" />
                      {hasAttended ? 'Attended' : 'RSVP Confirmed'}
                    </div>
                  )}

                  {event.rsvp_required ? (
                    hasRSVPed ? (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleCancelRSVP(event.id)}
                        disabled={hasAttended}
                      >
                        {hasAttended ? 'Already Attended' : 'Cancel RSVP'}
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleRSVP(event.id)}
                        disabled={isFull}
                      >
                        {isFull ? 'Event Full' : 'RSVP Now'}
                      </Button>
                    )
                  ) : (
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <EventModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
      />
    </div>
  );
};

export default Events;