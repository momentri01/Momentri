import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Heart, Gift, Share2, Calendar, MapPin, User, MessageCircle, X, ShoppingCart, Minus, Plus, CheckCircle2, ShieldCheck, Flag, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface EventData {
  id: string;
  title: string;
  description: string;
  eventType: string;
  eventDate: string;
  donationGoal: number;
  totalDonationsNet: number;
  currency: string;
  country: string;
  coverImageUrl: string;
  isVerified: boolean;
  owner: { fullName: string };
  wishlistItems: any[];
  donations: any[];
}

const PublicEvent: React.FC = () => {
  const { id: slug } = useParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const [donationForm, setDonationForm] = useState({
    donorName: '',
    donorEmail: '',
    grossAmount: '',
    message: '',
    isAnonymous: false,
  });

  const [purchaseForm, setPurchaseForm] = useState({
    buyerName: '',
    buyerEmail: '',
    quantity: 1,
    message: '',
    isAnonymous: false,
  });

  const [reportForm, setReportForm] = useState({
    reporterEmail: '',
    reason: 'Fraud or Scam',
    details: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Use the slug from the URL correctly
        const data = await api.get(`/events/${slug}`);
        setEvent(data);
      } catch (error) {
        console.error('Event not found');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();

    // Safely check params
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('donation_success')) {
      alert('Thank you for your donation!');
      // Replace state to clean URL without triggering a full page reload or route change
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [slug]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/donations', {
        ...donationForm,
        eventId: event?.id,
        grossAmount: parseFloat(donationForm.grossAmount),
        currency: event?.currency,
      });
      
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('Could not create checkout session');
      }
    } catch (error: any) {
      alert(error.message || 'Donation failed');
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/wishlist/purchase', {
        ...purchaseForm,
        wishlistItemId: selectedItem.id,
        quantity: purchaseForm.quantity,
      });
      
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('Could not create checkout session');
      }
    } catch (error) {
      alert('Purchase failed');
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reports', {
        ...reportForm,
        eventId: event?.id
      });
      alert('Report submitted successfully. Our team will review it.');
      setShowReportModal(false);
    } catch (error) {
      alert('Failed to submit report');
    }
  };

  const openPurchaseModal = (item: any) => {
    if (item.quantityPurchased >= item.quantityRequested) return;
    setSelectedItem(item);
    setPurchaseForm({ ...purchaseForm, quantity: 1 });
    setShowPurchaseModal(true);
  };

  if (loading) return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!event) return <div className="text-center py-24">Event not found</div>;

  const isGoalReached = Number(event.totalDonationsNet) >= Number(event.donationGoal);
  const progress = Math.min((Number(event.totalDonationsNet) / Number(event.donationGoal)) * 100, 100);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Title Section - Mobile Only */}
      <div className="lg:hidden px-4 pt-8 pb-4">
         <h1 className="text-2xl font-black text-gray-900 leading-tight">{event.title}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area (8 Columns) */}
          <div className="lg:col-span-8">
            <h1 className="hidden lg:block text-4xl font-black text-gray-900 mb-8 leading-tight">{event.title}</h1>
            
            {/* Cover Image */}
            <div className="aspect-[16/9] w-full rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm mb-10 border border-gray-100">
               {event.coverImageUrl ? (
                  <img src={event.coverImageUrl} className="w-full h-full object-cover" alt={event.title} />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/10">
                     <Heart size={120} fill="currentColor" />
                  </div>
               )}
            </div>

            {/* Host Info */}
            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-gray-100">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg text-balance">
                  {event.owner.fullName[0]}
               </div>
               <div>
                  <div className="flex items-center gap-2">
                     <p className="text-sm font-bold text-gray-900">{event.owner.fullName} is organizing this fundraiser.</p>
                     {event.isVerified && (
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100 animate-in fade-in duration-500">
                           <ShieldCheck size={12} className="fill-green-500 text-white" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                        </div>
                     )}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                     <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        Created {new Date(event.eventDate).toLocaleDateString()}
                     </span>
                     <span className="text-xs text-muted-foreground flex items-center gap-1 border-l pl-4">
                        <MapPin size={14} className="text-gray-400" />
                        {event.country}
                     </span>
                  </div>
               </div>
            </div>

            {/* Story / Description */}
            <div className="mb-16">
               <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="text-primary" size={20} />
                  <h2 className="text-lg font-black uppercase tracking-widest text-gray-400">The Story</h2>
               </div>
               <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">{event.description}</p>
               </div>
            </div>

            {/* Registry Section (If exists) */}
            {event.wishlistItems.length > 0 && (
               <div className="mb-16 p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h2 className="text-2xl font-black text-gray-900">Gift Registry</h2>
                        <p className="text-sm text-muted-foreground font-medium">Items selected by the host for this cause.</p>
                     </div>
                     <Gift className="text-primary" size={32} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {event.wishlistItems.map((item) => {
                        const isPurchased = item.quantityPurchased >= item.quantityRequested;
                        return (
                           <div 
                              key={item.id} 
                              onClick={() => openPurchaseModal(item)}
                              className={`p-5 rounded-2xl border-2 transition-all ${
                                 isPurchased 
                                 ? 'bg-white/50 border-transparent opacity-60 cursor-not-allowed' 
                                 : 'bg-white border-white hover:border-primary cursor-pointer active:scale-95 shadow-sm group'
                              }`}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                                    isPurchased ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white shadow-lg'
                                 }`}>
                                    {isPurchased ? <CheckCircle2 size={24}/> : <ShoppingCart size={24} />}
                                 </div>
                                 <div className="flex-1">
                                    <p className="font-bold text-sm text-gray-900">{item.itemName}</p>
                                    <div className="flex justify-between items-end mt-1">
                                       <p className={`text-[10px] font-black uppercase tracking-tighter ${isPurchased ? 'text-green-600' : 'text-primary'}`}>
                                          {isPurchased ? 'Fully Funded' : `${item.quantityRequested - item.quantityPurchased} left`}
                                       </p>
                                       <p className="text-sm font-black text-gray-900">{event.currency} {item.price}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}

            {/* Donors & Messages Feed */}
            <div className="mb-16">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-2">
                     <Users className="text-primary" size={24} />
                     <h2 className="text-2xl font-black text-gray-900">Supporters ({event.donations.length})</h2>
                  </div>
                  <button className="text-sm font-black text-primary hover:underline">See all</button>
               </div>
               
               <div className="space-y-8">
                  {event.donations.map((d) => (
                     <div key={d.id} className="flex gap-6 items-start animate-in slide-in-from-bottom-2 duration-500">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-primary font-black shadow-inner">
                           {d.isAnonymous ? '?' : d.donorName[0]}
                        </div>
                        <div className="flex-1 pb-8 border-b border-gray-50 last:border-0">
                           <div className="flex justify-between items-start mb-2">
                              <p className="font-black text-gray-900">{d.isAnonymous ? 'Anonymous' : d.donorName}</p>
                              <p className="text-sm font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{event.currency} {d.grossAmount}</p>
                           </div>
                           <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-3">
                              {new Date(d.createdAt).toLocaleDateString()}
                           </p>
                           {d.message && (
                              <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none relative italic text-gray-600 font-medium">
                                 "{d.message}"
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
                  {event.donations.length === 0 && (
                     <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed">
                        <MessageCircle size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-muted-foreground font-bold">No messages yet. Be the first to leave words of support!</p>
                     </div>
                  )}
               </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-4 py-10 border-t border-gray-100">
               <button 
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-red-500 transition-colors"
               >
                  <Flag size={16} />
                  Report fundraiser
               </button>
            </div>
          </div>

          {/* Sidebar / Donation Widget (4 Columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
               <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden relative">
                  {isGoalReached && (
                     <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-2xl shadow-lg z-10">
                        Success
                     </div>
                  )}

                  <div className="mb-8">
                     <div className="flex items-baseline gap-2 mb-2 text-balance">
                        <p className="text-3xl font-black text-gray-900">{event.currency} {Number(event.totalDonationsNet).toLocaleString()}</p>
                        <p className="text-sm font-bold text-muted-foreground">raised</p>
                     </div>
                     <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                        <span>{progress.toFixed(0)}% of {event.currency} {Number(event.donationGoal).toLocaleString()} goal</span>
                        <span>{event.donations.length} donors</span>
                     </div>
                     <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner">
                        <div 
                           className={`h-3 rounded-full transition-all duration-1000 ${isGoalReached ? 'bg-green-500' : 'bg-primary shadow-[0_0_15px_rgba(var(--primary),0.4)]'}`} 
                           style={{ width: `${progress}%` }} 
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     {isGoalReached ? (
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                           <CheckCircle2 className="text-green-600 mx-auto mb-3" size={32} />
                           <p className="font-black text-green-800 text-sm mb-1 uppercase tracking-tight">Fundraiser Successful!</p>
                           <p className="text-xs text-green-700 font-bold leading-relaxed">This goal has been met. Thank you to everyone who contributed!</p>
                        </div>
                     ) : (
                        <>
                           <button 
                              onClick={() => setShowDonationModal(true)}
                              className="w-full inline-flex items-center justify-center rounded-full bg-primary px-8 py-5 text-xl font-black text-primary-foreground shadow-[0_15px_30px_rgba(var(--primary),0.3)] transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
                           >
                              Donate Now
                           </button>
                           <button 
                              className="w-full inline-flex items-center justify-center rounded-full bg-white border-2 border-primary text-primary px-8 py-5 text-xl font-black shadow-sm transition-all hover:bg-primary/5 active:scale-95"
                           >
                              <Share2 className="mr-2 h-5 w-5" />
                              Share
                           </button>
                        </>
                     )}
                  </div>

                  <div className="mt-10 pt-10 border-t border-gray-50 text-balance">
                     <div className="flex flex-col items-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Scan to give</p>
                        <div className="p-4 bg-white border-2 border-gray-50 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                           <QRCodeSVG value={window.location.href} size={160} />
                        </div>
                        <div className="mt-6 flex flex-col items-center gap-2">
                           <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                              <ShieldCheck size={12} className="text-green-500" />
                              Secure & Encrypted Payments
                           </p>
                           {event.isVerified && (
                              <p className="text-[10px] text-green-600 font-black uppercase tracking-widest flex items-center gap-1">
                                 <ShieldCheck size={12} className="fill-green-600 text-white" />
                                 Momentri Verified
                              </p>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal - Styled */}
      {showDonationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 text-balance">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDonationModal(false)} />
           <div className="bg-white rounded-[2.5rem] p-8 md:p-12 w-full max-w-lg relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black tracking-tight text-gray-900">Make a Donation</h2>
                 <button onClick={() => setShowDonationModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-gray-400"><X size={20}/></button>
              </div>
              <form onSubmit={handleDonate} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Your Name</label>
                       <input
                          placeholder="Full Name"
                          required
                          className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 font-bold focus:border-primary focus:bg-white focus:ring-0 transition-all"
                          value={donationForm.donorName}
                          onChange={(e) => setDonationForm({...donationForm, donorName: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                       <input
                          placeholder="john@example.com"
                          required
                          type="email"
                          className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 font-bold focus:border-primary focus:bg-white focus:ring-0 transition-all"
                          value={donationForm.donorEmail}
                          onChange={(e) => setDonationForm({...donationForm, donorEmail: e.target.value})}
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Amount to Donate</label>
                    <div className="relative">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400 text-xl">{event.currency}</span>
                       <input
                          placeholder="0.00"
                          required
                          type="number"
                          className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 pl-14 pr-4 py-6 text-4xl font-black focus:border-primary focus:bg-white focus:ring-0 transition-all tracking-tighter"
                          value={donationForm.grossAmount}
                          onChange={(e) => setDonationForm({...donationForm, grossAmount: e.target.value})}
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Message of Support</label>
                    <textarea
                       placeholder="Say something kind to the host..."
                       className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-4 py-4 font-medium focus:border-primary focus:bg-white focus:ring-0 transition-all"
                       rows={3}
                       value={donationForm.message}
                       onChange={(e) => setDonationForm({...donationForm, message: e.target.value})}
                    />
                 </div>
                 <label className="flex items-center gap-3 cursor-pointer py-2 group">
                    <div className="relative">
                       <input 
                          type="checkbox" 
                          className="peer sr-only"
                          checked={donationForm.isAnonymous}
                          onChange={(e) => setDonationForm({...donationForm, isAnonymous: e.target.checked})}
                       />
                       <div className="w-6 h-6 border-2 border-gray-200 rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                          <CheckCircle2 size={14} className="text-white opacity-0 peer-checked:opacity-100" />
                       </div>
                    </div>
                    <span className="text-xs font-bold text-gray-600 group-hover:text-primary transition-colors">Hide my name from other donors</span>
                 </label>
                 <button className="w-full inline-flex items-center justify-center rounded-full bg-primary px-8 py-5 text-xl font-black text-primary-foreground shadow-lg hover:bg-primary/90 transition-all transform active:scale-95">
                    Continue to Payment
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 text-balance">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)} />
           <div className="bg-white rounded-[2.5rem] p-8 md:p-12 w-full max-w-lg relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="text-center mb-8">
                 <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                 </div>
                 <h2 className="text-2xl font-black tracking-tight text-gray-900">Report this fundraiser</h2>
                 <p className="text-sm text-muted-foreground font-medium mt-2">Help us keep Momentri safe. Tell us why you are reporting this fundraiser.</p>
              </div>

              <form onSubmit={handleReport} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Your Email</label>
                    <input
                       type="email"
                       required
                       className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 font-bold focus:border-primary focus:bg-white focus:ring-0 transition-all"
                       placeholder="your@email.com"
                       value={reportForm.reporterEmail}
                       onChange={(e) => setReportForm({...reportForm, reporterEmail: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Reason for Report</label>
                    <select
                       className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 font-bold focus:border-primary focus:bg-white focus:ring-0 transition-all"
                       value={reportForm.reason}
                       onChange={(e) => setReportForm({...reportForm, reason: e.target.value})}
                    >
                       <option>Fraud or Scam</option>
                       <option>Misleading Information</option>
                       <option>Offensive Content</option>
                       <option>Illegal Activity</option>
                       <option>Other</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Additional Details</label>
                    <textarea
                       placeholder="Please provide as much information as possible..."
                       required
                       className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-4 py-4 font-medium focus:border-primary focus:bg-white focus:ring-0 transition-all"
                       rows={4}
                       value={reportForm.details}
                       onChange={(e) => setReportForm({...reportForm, details: e.target.value})}
                    />
                 </div>
                 <button className="w-full inline-flex items-center justify-center rounded-full bg-red-500 px-8 py-5 text-xl font-black text-white shadow-lg hover:bg-red-600 transition-all transform active:scale-95">
                    Submit Report
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Purchase Modal - Styled */}
      {showPurchaseModal && selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 text-balance">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPurchaseModal(false)} />
           <div className="bg-white rounded-[2.5rem] p-8 md:p-12 w-full max-w-lg relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black tracking-tight text-gray-900">Purchase Item</h2>
                 <button onClick={() => setShowPurchaseModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-gray-400"><X size={20}/></button>
              </div>
              
              <div className="bg-primary/5 p-6 rounded-3xl border-2 border-primary/10 mb-8 flex items-center gap-5">
                 <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg flex-shrink-0">
                    <Gift size={28} />
                 </div>
                 <div className="flex-1 min-w-0 text-balance">
                    <p className="font-black text-gray-900 leading-tight truncate">{selectedItem.itemName}</p>
                    <p className="text-sm text-primary font-black mt-1">{event.currency} {selectedItem.price.toLocaleString()}</p>
                 </div>
              </div>

              <form onSubmit={handlePurchase} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Your Name</label>
                       <input
                          placeholder="Full Name"
                          required
                          className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 font-bold focus:border-primary focus:bg-white focus:ring-0 transition-all"
                          value={purchaseForm.buyerName}
                          onChange={(e) => setPurchaseForm({...purchaseForm, buyerName: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
                       <input
                          placeholder="john@example.com"
                          required
                          type="email"
                          className="w-full rounded-xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 font-bold focus:border-primary focus:bg-white focus:ring-0 transition-all"
                          value={purchaseForm.buyerEmail}
                          onChange={(e) => setPurchaseForm({...purchaseForm, buyerEmail: e.target.value})}
                       />
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="font-black text-xs uppercase tracking-widest text-gray-500">Quantity</span>
                    <div className="flex items-center gap-5">
                       <button 
                          type="button" 
                          onClick={() => setPurchaseForm({...purchaseForm, quantity: Math.max(1, purchaseForm.quantity - 1)})}
                          className="h-10 w-10 rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90"
                       >
                          <Minus size={18} />
                       </button>
                       <span className="font-black text-xl w-6 text-center">{purchaseForm.quantity}</span>
                       <button 
                          type="button" 
                          onClick={() => setPurchaseForm({...purchaseForm, quantity: Math.min(selectedItem.quantityRequested - selectedItem.quantityPurchased, purchaseForm.quantity + 1)})}
                          className="h-10 w-10 rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90"
                       >
                          <Plus size={18} />
                       </button>
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Add a Message</label>
                    <textarea
                       placeholder="A quick note for the host..."
                       className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-4 py-4 font-medium focus:border-primary focus:bg-white focus:ring-0 transition-all"
                       rows={3}
                       value={purchaseForm.message}
                       onChange={(e) => setPurchaseForm({...purchaseForm, message: e.target.value})}
                    />
                 </div>
                 
                 <div className="pt-6 border-t border-gray-100 mt-6">
                    <div className="flex justify-between items-center mb-6">
                       <span className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Grand Total</span>
                       <span className="text-3xl font-black text-primary tracking-tighter">{event.currency} {(selectedItem.price * purchaseForm.quantity).toLocaleString()}</span>
                    </div>
                    <button className="w-full inline-flex items-center justify-center rounded-full bg-primary px-8 py-5 text-xl font-black text-primary-foreground shadow-xl hover:bg-primary/90 transition-all transform active:scale-95">
                       Buy Item
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default PublicEvent;
