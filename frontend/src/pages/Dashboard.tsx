import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Plus, Calendar, Target, Users, Settings, Eye, CreditCard, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

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

interface Campaign {
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string | null;
  campaignGoal: number;
  totalDonationsNet: number;
  organizationId: string;
  // Add other relevant campaign fields here
}

interface UserProfile {
  stripeOnboardingComplete: boolean;
  stripeAccountId: string | null;
  role: string; // Added role for conditional rendering
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]); // State for campaigns
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    // If no user is logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await api.get('/users/profile');
        setProfile(profileData);

        let data: any[] = [];
        if (user.role === 'ORGANIZATION') {
          // Fetch campaigns for organizations
          const campaignData = await api.get('/campaigns');
          data = campaignData;
          setCampaigns(data); // Use setCampaigns for organization data
        } else {
          // Fetch events for individuals
          const eventsData = await api.get('/events/my');
          data = eventsData;
          setEvents(data); // Use setEvents for individual data
        }
        
        // Check stripe status if account exists but not complete
        if (profileData.stripeAccountId && !profileData.stripeOnboardingComplete) {
            await api.get('/users/stripe/status'); // Assuming this endpoint updates status
            const updatedProfile = await api.get('/users/profile');
            setProfile(updatedProfile);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error); // Corrected typo here
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.role]); // Re-fetch if user role changes (though unlikely in current flow)

  const handleStripeConnect = async () => {
    setStripeLoading(true);
    try {
      const response = await api.post('/users/stripe/connect', {});
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      alert('Failed to connect with Stripe');
    } finally {
      setStripeLoading(false);
    }
  };

  // Calculate total raised from events for individual users
  const totalEventsRaised = events.reduce((acc, event) => acc + Number(event.totalDonationsNet), 0);

  // Calculate total raised from campaigns for organization users
  const totalCampaignsRaised = campaigns.reduce((acc, campaign) => acc + Number(campaign.totalDonationsNet), 0);

  // Helper function to determine status class for badges
  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'COMPLETED':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user.role === 'ORGANIZATION' ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
              <p className="text-muted-foreground">Manage your fundraising campaigns and track your impact.</p>
            </div>
            <div className="flex gap-4">
                <Link
                to="/create-campaign" // Navigate to a new create campaign page
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
                >
                <Plus className="mr-2 h-4 w-4" />
                Create New Campaign
                </Link>
            </div>
          </div>
          
          {/* Campaigns Overview for Organizations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
             <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Net Raised (All Campaigns)</p>
                <p className="text-2xl font-bold text-primary">${totalCampaignsRaised.toFixed(2)}</p> {/* Use totalCampaignsRaised */}
             </div>
             <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'ACTIVE').length}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <p className="text-sm font-medium text-muted-foreground mb-1">Completed Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'COMPLETED').length}</p>
             </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Your Campaigns</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed">
              <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No campaigns yet</h3>
              <p className="text-muted-foreground mb-6">Start your first fundraising campaign today!</p>
              <Link to="/create-campaign" className="text-primary font-bold hover:underline">
                Create a Campaign &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mb-2">
                          {campaign.status}
                        </span>
                        <h3 className="text-lg font-bold leading-tight">{campaign.title}</h3>
                      </div>
                      {/* Use helper function for status class */}
                      <span className={`h-2 w-2 rounded-full ${getStatusClass(campaign.status)}`} />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-bold">${campaign.totalDonationsNet} / ${campaign.campaignGoal}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ width: `${Math.min((Number(campaign.totalDonationsNet) / Number(campaign.campaignGoal)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar size={14} className="mr-2" />
                        {new Date(campaign.startDate).toLocaleDateString()} - {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Ongoing'}
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <Link
                        to={`/manage-campaign?id=${campaign.id}`} // New route for managing campaigns
                        className="flex-1 inline-flex items-center justify-center rounded-lg bg-muted px-4 py-2 text-sm font-bold transition-colors hover:bg-muted/80"
                      >
                        <Settings size={14} className="mr-2" />
                        Manage
                      </Link>
                      <Link
                        to={`/campaign/${campaign.id}`} // Public campaign view
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
        </>
      ) : (
        <>
          {/* Individual User Dashboard Content */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-muted-foreground">Manage your events and track your progress.</p>
            </div>
            <div className="flex gap-4">
                <Link
                to="/create-event"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
                >
                <Plus className="mr-2 h-4 w-4" />
                Create New Event
                </Link>
            </div>
          </div>

          {/* Stats Overview for Individuals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Net Raised</p>
                <p className="text-2xl font-bold text-primary">${totalEventsRaised.toFixed(2)}</p> {/* Use totalEventsRaised */}
             </div>
             <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Events</p>
                <p className="text-2xl font-bold">{events.filter(e => e.status === 'ACTIVE').length}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <p className="text-sm font-medium text-muted-foreground mb-1">Successful Campaigns</p>
                <p className="text-2xl font-bold">{events.filter(e => Number(e.totalDonationsNet) >= Number(e.donationGoal)).length}</p> {/* This stat might be misleading for individuals */}
             </div>
             {/* Payout Status Card - likely for organizations, but might be hidden or irrelevant for individuals */}
             {profile?.stripeAccountId && (
                <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
                   <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Payout Status</p>
                      {profile?.stripeOnboardingComplete ? (
                         <div className="flex items-center gap-2 text-green-600 font-bold">
                            <CheckCircle2 size={16} />
                            <span>Active</span>
                         </div>
                      ) : (
                         <div className="flex items-center gap-2 text-amber-600 font-bold">
                            <AlertCircle size={16} />
                            <span>Action Required</span>
                         </div>
                      )}
                   </div>
                   {!profile?.stripeOnboardingComplete && (
                      <button 
                         onClick={handleStripeConnect}
                         disabled={stripeLoading}
                         className="mt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                         {stripeLoading ? 'Connecting...' : 'Set Up Payouts'}
                      </button>
                   )}
                </div>
             )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Your Events</h2>
          </div>

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
        </>
      )}
    </div>
  );
};

export default Dashboard;
