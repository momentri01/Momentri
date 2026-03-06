import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Plus, Calendar, Target, Users, Settings, Eye } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  eventType: string;
  eventDate: string;
  donationGoal: number;
  totalDonationsNet: number;
  status: string;
  slug: string;
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.get('/events/my');
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const totalRaised = events.reduce((acc, event) => acc + Number(event.totalDonationsNet), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and track your progress.</p>
        </div>
        <Link
          to="/create-event"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Event
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Net Raised</p>
          <p className="text-2xl font-bold text-primary">${totalRaised.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Active Events</p>
          <p className="text-2xl font-bold">{events.filter(e => e.status === 'ACTIVE').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Successful Campaigns</p>
          <p className="text-2xl font-bold">{events.filter(e => Number(e.totalDonationsNet) >= Number(e.donationGoal)).length}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Your Events</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed">
          <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No events yet</h3>
          <p className="text-muted-foreground mb-6">Start your first fundraising campaign today!</p>
          <Link to="/create-event" className="text-primary font-bold hover:underline">
            Create an Event &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mb-2">
                      {event.eventType}
                    </span>
                    <h3 className="text-lg font-bold leading-tight">{event.title}</h3>
                  </div>
                  <span className={`h-2 w-2 rounded-full ${event.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-bold">${event.totalDonationsNet} / ${event.donationGoal}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min((Number(event.totalDonationsNet) / Number(event.donationGoal)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar size={14} className="mr-2" />
                    {new Date(event.eventDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Link
                    to={`/manage-event?id=${event.id}`}
                    className="flex-1 inline-flex items-center justify-center rounded-lg bg-muted px-4 py-2 text-sm font-bold transition-colors hover:bg-muted/80"
                  >
                    <Settings size={14} className="mr-2" />
                    Manage
                  </Link>
                  <Link
                    to={`/public-event/${event.slug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-bold transition-colors hover:bg-muted"
                  >
                    <Eye size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
