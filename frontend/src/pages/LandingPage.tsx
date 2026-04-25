import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Rocket, Shield, HandHeart, Gift, ArrowRight, CheckCircle2, Users, Star, Zap, Globe, Calendar, Target, Settings, Eye, CreditCard, AlertCircle, ShieldAlert, Plus, X, Search, Image as ImageIcon } from 'lucide-react';

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
    { title: "Community Garden Project", raised: 2100, goal: 3000, img: "https://images.unsplash.com/photo-1466692476868-aef1dfb15d4c2?auto=format&fit=crop&q=80&w=1200" },
    { title: "Sarah's Medical Fund", raised: 12500, goal: 15000, img: "https://images.unsplash.com/photo-1579684385127-1ecd15d5b8bd?auto=format&fit=crop&q=80&w=1200" },
    { title: "Local School Library", raised: 5200, goal: 7500, img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200" },
    { title: "Animal Shelter Rescue", raised: 3800, goal: 5000, img: "https://images.unsplash.com/photo-154819997303d6c6a58c0f?auto=format&fit=crop&q=80&w=1200" },
    { title: "Tech for Kids Workshop", raised: 9100, goal: 10000, img: "https://images.unsplash.com/photo-1503676260728-a1c7d51611b?auto=format&fit=crop&q=80&w=1100" },
    { title: "Ocean Cleanup Initiative", raised: 18000, goal: 20000, img: "https://images.unsplash.com/photo-1621451537084-a878a870f80?auto=format&fit=crop&q=80&w=1200" },
    { title: "Youth Sports Equipment", raised: 1500, goal: 2500, img: "https://images.unsplash.com/photo-1461896836934-aef1dfb15d4c2?auto=format&fit=crop&q=80&w=1200" },
    { title: "Music Lessons for All", raised: 4200, goal: 6000, img: "https://images.unsplash.1511379938547-a1c7d51611b?auto=format&fit=crop&q=80&w=1200" },
    { title: "Park Renovation", raised: 7800, goal: 9000, img: "https://images.unsplash.com/photo-1441974231531-a6c1d51611b?auto=format&fit=crop&q=80&w=1200" },
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
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] duration-700" />
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
                Momentris combines direct donations with a beautiful gift registry. 
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
                       <img key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User avatar" />
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
                         <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Live Campaign</p>
                         <p className="font-bold text-gray-900">{currentCampaign.title}</p>
                      </div>
                      <p className="font-black text-primary">${currentCampaign.raised.toLocaleString()} raised</p>
                   </div>
                   <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(currentCampaign.raised / currentCampaign.goal) * 100}%` }}
                      />
                   </div>
                </div>
              </div>
              {/* Floating element */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border animate-bounce duration-[3000ms] hidden sm:block">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                       <HandHeart size={20} fill="currentColor" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase">New Donation</p>
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
               <div className="text-2xl font-black">MOMENTRIS</div>
               <div className="text-2xl font-black italic">HEARTCORE</div>
            </div>
         </div>
      </section>

      {/* Feature Section with Images */}
      <section className="py-24 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-32 items-center mb-32">
               <div>
                  <div className="inline-flex items-center gap-2 text-primary font-black uppercase text-xs tracking-[0.2em] mb-8">
                     <Zap size={20} fill="currentColor" />
                    Powerful Integration
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-10 leading-tight tracking-tight">One platform, endless possibilities</h2>
                  <p className="text-lg text-muted-foreground mb-8 font-medium">
                     Simple tools built for transparency, speed, and beautiful design.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="p-6 bg-white rounded-3xl border shadow-sm">
                        <CheckCircle2 className="text-green-500 mb-4" size={24} />
                        <p className="font-black text-gray-900 mb-2">Direct Donations</p>
                        <p className="text-sm text-gray-600 font-medium">Effortlessly collect funds for any cause.</p>
                     </div>
                     <div className="p-6 bg-white rounded-3xl border shadow-sm">
                        <Gift className="text-blue-500 mb-4" size={24} />
                        <p className="font-black text-gray-900 mb-2">Gift Registries</p>
                        <p className="text-sm text-gray-600 font-medium">Curate wishlists for milestones and events.</p>
                     </div>
                  </div>
               </div>
               <div className="relative mt-20 lg:mt-0">
                  <div className="rounded-[4rem] overflow-hidden shadow-3xl rotate-2 hover:rotate-0 transition-transform duration-700">
                     <img 
                        src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200" 
                        alt="Charity work in progress" 
                        className="w-full aspect-[4/5] object-cover scale-110 hover:scale-100 transition-transform duration-700"
                     />
                  </div>
               </div>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-32 items-center mt-32">
               <div className="order-2 lg:order-1 relative">
                  <div className="rounded-[4rem] overflow-hidden shadow-3xl -rotate-2 hover:rotate-0 transition-transform duration-700">
                     <img 
                        src="https://images.unsplash.com/photo-1532629345422-a1c7d51611b?auto=format&fit=crop&q=80&w=800" 
                        alt="Team collaborating" 
                        className="w-full aspect-[4/5] object-cover scale-110 hover:scale-100 transition-transform duration-700"
                     />
                  </div>
               </div>
               <div className="order-1 lg:order-2">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                     <Users size={24} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Community-driven fundraising</h3>
                  <p className="text-lg text-muted-foreground mb-8 font-medium">
                     Empower your community to rally around causes they care about. With tools for sharing and updates, keep everyone engaged.
                  </p>
                  <ul className="space-y-4">
                     {['Seamless sharing tools', 'Real-time progress updates', 'Donor engagement features', 'Transparent fund distribution'].map(item => (
                        <li key={item} className="flex items-center gap-3 font-bold text-gray-700">
                           <CheckCircle2 className="text-green-500" size={20} />
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[3.5rem] p-16 md:p-28 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
               <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tight leading-tight">Ready to start your <br /> next campaign?</h2>
               <p className="text-xl text-slate-400 mb-14 font-medium leading-relaxed">
                 Join thousands of organizers who use Momentris to fund weddings, baby showers, and community causes.
               </p>
               <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    to="/register" // Pointing to register for org sign up
                    className="inline-flex items-center justify-center rounded-full bg-white px-12 py-6 text-xl font-bold text-primary shadow-2xl shadow-primary/40 transition-all hover:bg-slate-50 hover:scale-105 active:scale-95"
                  >
                    Get Started Now
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-primary-foreground/10 border border-white/20 px-12 py-6 text-xl font-bold text-white transition-all hover:bg-primary-foreground/20"
                  >
                    Contact Us
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
