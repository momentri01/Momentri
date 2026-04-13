import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { LayoutDashboard, Users, Gift, CreditCard, ExternalLink, Settings as SettingsIcon, ChevronRight, X, Smartphone, Landmark, CheckCircle2 } from 'lucide-react';

const ManageEvent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('id');
  const [activeTab, setActiveTab] = useState('overview');
  const [event, setEvent] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    payoutMethod: 'Stripe Connect',
    details: {}
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const [eventData, withdrawalData, profileData] = await Promise.all([
          api.get(`/events/${eventId}`),
          api.get('/withdrawals/my'),
          api.get('/users/profile')
        ]);
        setEvent(eventData);
        setWithdrawals(withdrawalData.filter((w: any) => w.eventId === eventId));
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEventDetails();
  }, [eventId]);

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

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.stripeOnboardingComplete) {
        alert('Please complete Stripe onboarding first.');
        return;
    }
    try {
      await api.post('/withdrawals', {
        eventId,
        amount: parseFloat(withdrawForm.amount),
        payoutMethod: 'Stripe',
        payoutDetails: { stripeAccountId: profile.stripeAccountId }
      });
      alert('Withdrawal request submitted successfully! An admin will process it shortly.');
      setShowWithdrawModal(false);
      window.location.reload();
    } catch (error: any) {
      alert(error.message || 'Withdrawal request failed');
    }
  };

  if (loading) return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!event) return <div className="text-center py-24">Event not found</div>;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'donations', name: 'Donations', icon: Users },
    { id: 'wishlist', name: 'Wishlist', icon: Gift },
    { id: 'withdrawals', name: 'Withdrawals', icon: CreditCard },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
             <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
             <ChevronRight size={14} />
             <span className="font-bold text-gray-900">Manage Event</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
        </div>
        <div className="flex gap-2">
           <Link
             to={`/public-event/${event.slug}`}
             className="inline-flex items-center justify-center rounded-full bg-white border px-6 py-2 text-sm font-bold shadow-sm hover:bg-muted transition-colors"
           >
             <ExternalLink size={16} className="mr-2" />
             View Public Page
           </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-gray-900'
            }`}
          >
            <tab.icon size={18} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                     <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Gross Raised</p>
                     <p className="text-2xl font-bold">{event.currency} {event.totalDonationsGross}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                     <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Net Balance</p>
                     <p className="text-2xl font-bold text-primary">{event.currency} {event.totalDonationsNet}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                     <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Goal Status</p>
                     <p className="text-2xl font-bold">{Math.round((Number(event.totalDonationsNet) / Number(event.donationGoal)) * 100)}%</p>
                  </div>
               </div>

               <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
                  <h3 className="text-lg font-bold mb-6">Recent Donations</h3>
                  <div className="space-y-4">
                     {event.donations.slice(0, 5).map((d: any) => (
                        <div key={d.id} className="flex items-center justify-between p-4 rounded-xl border-b last:border-0">
                           <div>
                              <p className="font-bold text-sm">{d.isAnonymous ? 'Anonymous' : d.donorName}</p>
                              <p className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</p>
                           </div>
                           <p className="font-bold text-green-600">+{event.currency} {d.grossAmount}</p>
                        </div>
                     ))}
                     {event.donations.length === 0 && <p className="text-muted-foreground text-center py-8">No donations yet.</p>}
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                  <h3 className="font-bold mb-4 text-sm uppercase tracking-widest">Event Link</h3>
                  <div className="bg-white p-2 rounded-xl border flex items-center gap-2 mb-4 shadow-sm">
                     <input 
                        readOnly 
                        className="flex-1 bg-transparent text-[10px] px-2 focus:outline-none font-medium truncate" 
                        value={`${window.location.origin}/public-event/${event.slug}`} 
                     />
                     <button 
                        onClick={() => {
                           navigator.clipboard.writeText(`${window.location.origin}/public-event/${event.slug}`);
                           alert('Link copied!');
                        }}
                        className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90"
                     >
                        <CreditCard size={12} />
                     </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Share this link with your supporters to start collecting donations.</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
           <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-muted/50">
                    <tr>
                       <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Donor</th>
                       <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Amount</th>
                       <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Net</th>
                       <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Date</th>
                       <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y">
                    {event.donations.map((d: any) => (
                       <tr key={d.id} className="hover:bg-muted/5">
                          <td className="px-6 py-4">
                             <p className="font-bold text-sm">{d.isAnonymous ? 'Anonymous' : d.donorName}</p>
                             <p className="text-xs text-muted-foreground">{d.donorEmail}</p>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold">{event.currency} {d.grossAmount}</td>
                          <td className="px-6 py-4 text-sm text-primary font-bold">{event.currency} {d.netAmount}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                             <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800 uppercase tracking-tighter">
                                {d.paymentStatus}
                             </span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {event.donations.length === 0 && <p className="text-center py-24 text-muted-foreground">No donations found.</p>}
           </div>
        )}

        {activeTab === 'wishlist' && (
           <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold">Registry Items</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {event.wishlistItems.map((item: any) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
                       <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Gift size={24} />
                       </div>
                       <div>
                          <p className="font-bold text-sm">{item.itemName}</p>
                          <p className="text-xs text-muted-foreground font-medium">{item.quantityPurchased} of {item.quantityRequested} purchased</p>
                          <p className="text-sm font-bold text-primary mt-1">{event.currency} {item.price}</p>
                       </div>
                    </div>
                 ))}
                 {event.wishlistItems.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-muted/20 rounded-[3rem] border border-dashed border-muted-foreground/30">
                       <p className="text-muted-foreground font-medium">Your registry is empty.</p>
                    </div>
                 )}
              </div>
           </div>
        )}

        {activeTab === 'withdrawals' && (
           <div className="space-y-12">
              <div className="max-w-2xl mx-auto text-center">
                 <div className="bg-white p-12 rounded-[3rem] border shadow-xl">
                    <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                       <CreditCard size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">Available Balance</h3>
                    <p className="text-5xl font-black text-primary mb-8 tracking-tighter">
                      {event.currency} {(Number(event.totalDonationsNet) - Number(event.withdrawnAmount || 0)).toFixed(2)}
                    </p>
                    <button 
                       onClick={() => setShowWithdrawModal(true)}
                       className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                    >
                       Request Payout
                    </button>
                    <p className="text-[10px] text-muted-foreground mt-6 font-bold uppercase tracking-widest">
                       Total Processed: {event.currency} {event.withdrawnAmount || 0}
                    </p>
                 </div>
              </div>

              <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
                 <div className="px-8 py-6 border-b">
                    <h3 className="font-bold">Request History</h3>
                 </div>
                 <table className="w-full text-left">
                    <thead className="bg-muted/50 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                       <tr>
                          <th className="px-8 py-4">Method</th>
                          <th className="px-8 py-4">Amount</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4">Requested On</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y">
                       {withdrawals.map((w) => (
                          <tr key={w.id} className="text-sm">
                             <td className="px-8 py-4 font-bold">{w.payoutMethod}</td>
                             <td className="px-8 py-4 font-bold">{event.currency} {w.amount}</td>
                             <td className="px-8 py-4">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${
                                   w.status === 'PROCESSED' ? 'bg-green-100 text-green-800' : 
                                   w.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                                   'bg-yellow-100 text-yellow-800'
                                }`}>
                                   {w.status}
                                </span>
                             </td>
                             <td className="px-8 py-4 text-muted-foreground">{new Date(w.createdAt).toLocaleDateString()}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {withdrawals.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground font-medium text-xs">
                       No withdrawal history.
                    </div>
                 )}
              </div>
           </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)} />
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 w-full max-w-lg relative z-10 shadow-2xl">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black tracking-tight">Request Payout</h2>
                  <button onClick={() => setShowWithdrawModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors"><X size={20}/></button>
               </div>

               <form onSubmit={handleRequestWithdrawal} className="space-y-6">
                  {!profile?.stripeOnboardingComplete ? (
                     <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-center">
                        <AlertCircle className="text-amber-600 mx-auto mb-3" size={32} />
                        <p className="font-bold text-amber-800 text-sm mb-2">Stripe Onboarding Required</p>
                        <p className="text-xs text-amber-700 font-medium mb-6">To receive payouts, you must first connect your account with Stripe.</p>
                        <button 
                           type="button"
                           onClick={handleStripeConnect}
                           disabled={stripeLoading}
                           className="w-full inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all active:scale-95"
                        >
                           {stripeLoading ? 'Connecting...' : 'Set Up Payouts with Stripe'}
                        </button>
                     </div>
                  ) : (
                     <>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3 mb-6">
                           <CheckCircle2 className="text-green-600" size={20} />
                           <div className="flex-1">
                              <p className="text-[10px] font-black uppercase text-green-700 tracking-widest">Payouts Active</p>
                              <p className="text-xs font-bold text-green-800">Funds will be sent to your connected Stripe account.</p>
                           </div>
                        </div>

                        <div>
                           <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Amount to Withdraw</label>
                           <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">{event.currency}</span>
                              <input
                                 type="number"
                                 required
                                 max={Number(event.totalDonationsNet) - Number(event.withdrawnAmount || 0)}
                                 className="w-full rounded-2xl border-border bg-muted/20 pl-12 pr-4 py-4 text-2xl font-black"
                                 placeholder="0.00"
                                 value={withdrawForm.amount}
                                 onChange={(e) => setWithdrawForm({...withdrawForm, amount: e.target.value})}
                              />
                           </div>
                           <p className="text-[10px] text-muted-foreground mt-2 font-bold">Max available: {event.currency} {(Number(event.totalDonationsNet) - Number(event.withdrawnAmount || 0)).toFixed(2)}</p>
                        </div>

                        <button className="w-full inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-black text-primary-foreground shadow-lg hover:bg-primary/90 transition-all active:scale-95">
                           Submit Request
                        </button>
                     </>
                  )}
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default ManageEvent;
