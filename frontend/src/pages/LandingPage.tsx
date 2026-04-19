import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Shield, Heart, Gift, ArrowRight, CheckCircle2, Users, Star, Zap, Globe } from 'lucide-react';
import { api } from '../lib/api';

const LandingPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeSupporters: 0,
    activeEvents: 0
  });

  const [campaignIndex, setCampaignIndex] = useState(0);
  const [activePhrase, setActivePhrase] = useState(0);
  const mockCampaigns = [
    { title: "The Thompson Wedding", raised: 8450, goal: 10000, img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200" },
    { title: "Community Garden Project", raised: 2100, goal: 3000, img: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1200" },
    { title: "Sarah's Medical Fund", raised: 12500, goal: 15000, img: "https://images.unsplash.com/photo-1579684385127-1ecd15d5b8bd?auto=format&fit=crop&q=80&w=1200" },
    { title: "Local School Library", raised: 5200, goal: 7500, img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200" },
    { title: "Animal Shelter Rescue", raised: 3800, goal: 5000, img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200" },
    { title: "Tech for Kids Workshop", raised: 9100, goal: 10000, img: "https://images.unsplash.com/photo-1503676260728-1c09da0947fe?auto=format&fit=crop&q=80&w=1200" },
    { title: "Ocean Cleanup Initiative", raised: 18000, goal: 20000, img: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=1200" },
    { title: "Youth Sports Equipment", raised: 1500, goal: 2500, img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1200" },
    { title: "Music Lessons for All", raised: 4200, goal: 6000, img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=1200" },
    { title: "Park Renovation", raised: 7800, goal: 9000, img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200" },
  ];

  const phrases = ["what matters.", "your dreams.", "your community.", "every milestone.", "urgent causes."];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/public/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch platform stats');
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCampaignIndex((prev) => (prev + 1) % mockCampaigns.length);
      setActivePhrase((prev) => (prev + 1) % phrases.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentCampaign = mockCampaigns[campaignIndex];

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <Zap size={14} fill="currentColor" />
                The Future of Fundraising
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-[1.1] mb-6">
                Raise money for <br />
                <span className="text-primary relative inline-block animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {phrases[activePhrase]}
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/30" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
                Momentri combines direct donations with a beautiful gift registry. 
                Perfect for weddings, community causes, and everything in between.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to={localStorage.getItem('token') ? '/dashboard' : '/register'}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-[0_20px_50px_rgba(var(--primary),0.3)] transition-all hover:bg-primary/90 hover:-translate-y-1"
                >
                  Start Fundraising Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/home"
                  className="inline-flex items-center justify-center rounded-full bg-white border-2 border-gray-100 px-10 py-5 text-lg font-bold text-gray-900 shadow-sm transition-all hover:bg-gray-50"
                >
                  Explore Events
                </Link>
              </div>
              
              <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
                 <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                       <img key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    ))}
                 </div>
                 <p><span className="font-bold text-gray-900">{(stats.activeSupporters + 1200).toLocaleString()}+</span> happy organizers already joined</p>
              </div>
            </div>
            <div className="mt-16 lg:mt-0 lg:col-span-6 relative">
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white ring-1 ring-gray-100 h-[450px]">
                <img 
                  src={currentCampaign.img}
                  alt="Happy event celebration"
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                   <div className="flex justify-between items-end mb-3">
                      <div>
                         <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Live Campaign</p>
                         <p className="font-bold text-gray-900">{currentCampaign.title}</p>
                      </div>
                      <p className="font-black text-primary">${currentCampaign.raised.toLocaleString()} raised</p>
                   </div>
                   <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500" 
                        style={{ width: `${(currentCampaign.raised / currentCampaign.goal) * 100}%` }}
                      />
                   </div>
                </div>
              </div>
              {/* Floating element */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border animate-bounce duration-[3000ms] hidden sm:block">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                       <Heart size={20} fill="currentColor" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase">New Donation</p>
                       <p className="text-xs font-black">+$250.00</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-y bg-gray-50/50">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Trusted by communities worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale">
               <div className="text-2xl font-black italic">TRUSTEE</div>
               <div className="text-2xl font-black">GIVING.CO</div>
               <div className="text-2xl font-black tracking-tighter underline underline-offset-4">REGISTRY.</div>
               <div className="text-2xl font-black">MOMENTRI</div>
               <div className="text-2xl font-black italic">HEARTCORE</div>
            </div>
         </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-[2rem] bg-gray-50 border transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Globe size={32} />
              </div>
              <p className="text-4xl font-black text-gray-900 mb-2">${stats.totalRaised.toLocaleString()}</p>
              <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Total Funds Raised</p>
            </div>
            <div className="p-8 rounded-[2rem] bg-gray-50 border transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Users size={32} />
              </div>
              <p className="text-4xl font-black text-gray-900 mb-2">{stats.activeSupporters.toLocaleString()}</p>
              <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Active Supporters</p>
            </div>
            <div className="p-8 rounded-[2rem] bg-gray-50 border transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Star size={32} />
              </div>
              <p className="text-4xl font-black text-gray-900 mb-2">{stats.activeEvents.toLocaleString()}</p>
              <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Active Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section with Images */}
      <section className="py-24 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">One platform, endless possibilities</h2>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">Simple tools built for transparency, speed, and beautiful design.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
               <div>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                     <Gift size={24} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6 text-balance">The ultimate gift registry for life's biggest milestones</h3>
                  <p className="text-lg text-muted-foreground mb-8">
                     Instead of just asking for cash, curate a beautiful list of items your supporters can purchase. 
                     We handle the fulfillment, you focus on the celebration.
                  </p>
                  <ul className="space-y-4">
                     {['Curated product catalog', 'Instant order notifications', 'Secure admin fulfillment', 'Privacy-first delivery addresses'].map(item => (
                        <li key={item} className="flex items-center gap-3 font-bold text-gray-700">
                           <CheckCircle2 className="text-green-500" size={20} />
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="relative">
                  <div className="rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                     <img 
                        src="/mom-to-be-registry.png" 
                        alt="Joyful mom-to-be opening gifts" 
                        className="w-full h-full object-cover"
                     />
                  </div>
                  <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border max-w-[200px]">
                     <div className="flex items-center gap-2 mb-2">
                        <Star className="text-yellow-400" size={16} fill="currentColor" />
                        <span className="font-black text-sm">4.9/5</span>
                     </div>
                     <p className="text-xs text-muted-foreground font-bold italic">"Easiest registry I've ever used!"</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
               <div className="order-2 md:order-1">
                  <div className="rounded-[3rem] overflow-hidden shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-500">
                     <img 
                        src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800" 
                        alt="Charity support" 
                        className="w-full h-full object-cover"
                     />
                  </div>
               </div>
               <div className="order-1 md:order-2">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                     <Heart size={24} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Direct impact through simple donations</h3>
                  <p className="text-lg text-muted-foreground mb-8">
                     Collect funds for emergencies, memorials, or community projects. 
                     Our low-fee structure ensures more money goes where it's needed most.
                  </p>
                  <div className="p-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-300">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-primary font-black">QR</div>
                        <div>
                           <p className="text-sm font-black">Scan to Donate</p>
                           <p className="text-xs text-muted-foreground">Every event gets a custom QR code instantly.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-primary/5">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-10 text-primary">
               <Heart size={48} className="mx-auto" fill="currentColor" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10 leading-tight italic">
               "Momentri changed how our community raises funds. It’s professional, beautiful, and so easy for donors to use. We raised $10k in just two weeks!"
            </h2>
            <div className="flex flex-col items-center">
               <img src="https://i.pravatar.cc/150?u=sarah" className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-4" alt="Sarah" />
               <p className="font-black text-gray-900">Sarah Jenkins</p>
               <p className="text-sm text-muted-foreground font-bold">Community Outreach Director</p>
            </div>
         </div>
      </section>

      {/* B2B Promo Section */}
      <section className="py-24 bg-white border-y">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-50 rounded-[3rem] p-10 md:p-16 border flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                    <Globe size={14} />
                    For Organizations & Charities
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Scale your impact with Momentri for Business</h2>
                  <p className="text-lg text-muted-foreground mb-8 font-medium">
                     Professional tools for registered charities, nonprofits, and corporate CSR teams. 
                     Issue tax receipts, manage donors, and access detailed impact analytics.
                  </p>
                  <Link
                    to="/b2b"
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-gray-800 hover:-translate-y-1"
                  >
                    Explore Organization Tools
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
               </div>
               <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
                     <p className="text-2xl font-black text-primary mb-1">Low</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Platform Fees</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
                     <p className="text-2xl font-black text-primary mb-1">Direct</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Tax Receipts</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border text-center col-span-2">
                     <p className="text-2xl font-black text-primary mb-1">Verified</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Organization Trust Badges</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10">
               <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Ready to start your <br /> next campaign?</h2>
               <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
                 Join thousands of organizers who use Momentri to fund weddings, baby showers, and community causes.
               </p>
               <Link
                 to="/register"
                 className="inline-flex items-center justify-center rounded-full bg-white px-12 py-6 text-xl font-bold text-primary shadow-2xl transition-all hover:bg-gray-50 hover:scale-105 active:scale-95"
               >
                 Launch Your Event Now
                 <Rocket className="ml-2 h-6 w-6" />
               </Link>
               <p className="mt-8 text-sm text-gray-500 font-bold">No credit card required. Launch in minutes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
