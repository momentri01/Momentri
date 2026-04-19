import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Heart, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Globe,
  Gift,
  HandHeart,
  Briefcase
} from 'lucide-react';

const B2B: React.FC = () => {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-950">
        {/* Animated Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse duration-700" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="sm:text-center md:max-w-3xl md:mx-auto lg:col-span-7 lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md border border-white/10">
                <Building2 size={16} className="text-primary" />
                Momentri for Organizations
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05] mb-8 text-balance">
                Empower your mission with <span className="text-primary italic">modern fundraising.</span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed mb-12 max-w-2xl">
                The enterprise-grade platform for charities and nonprofits to raise funds, manage registries, and scale social impact with radical transparency.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:bg-primary/90 hover:-translate-y-1 active:translate-y-0"
                >
                  Register Organization
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-white/5 border border-white/20 px-10 py-5 text-lg font-bold text-white shadow-sm transition-all hover:bg-white/10 backdrop-blur-sm"
                >
                  Schedule a Demo
                </Link>
              </div>
            </div>
            
            <div className="mt-20 lg:mt-0 lg:col-span-5 relative">
               <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-[3rem] p-1 border border-white/10 shadow-3xl">
                  <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2.9rem] p-8">
                    <div className="flex items-center justify-between mb-10">
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-400/40" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
                          <div className="w-3 h-3 rounded-full bg-green-400/40" />
                       </div>
                       <div className="px-4 py-1.5 rounded-full bg-slate-800/80 text-[10px] font-bold text-slate-400 tracking-widest uppercase border border-white/5">Organization Portal</div>
                    </div>
                    
                    <div className="space-y-8">
                       <div className="grid grid-cols-2 gap-5">
                          <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Funds Raised</p>
                             <p className="text-3xl font-black text-white">$2.4M</p>
                          </div>
                          <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Verified Donors</p>
                             <p className="text-3xl font-black text-white">12.8k</p>
                          </div>
                       </div>
                       
                       <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                          <div className="flex justify-between items-center mb-5">
                             <p className="font-bold text-slate-200">Annual Charity Drive</p>
                             <p className="text-primary font-black">88%</p>
                          </div>
                          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-1">
                             <div className="h-full bg-primary w-[88%] rounded-full shadow-[0_0_25px_rgba(var(--primary),0.6)] animate-pulse" />
                          </div>
                       </div>

                       <div className="space-y-4">
                          {[1, 2].map(i => (
                             <div key={i} className="flex items-center gap-5 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                   <Heart size={24} fill={i === 1 ? "currentColor" : "none"} />
                                </div>
                                <div className="flex-1">
                                   <div className="h-2.5 w-32 bg-slate-700 rounded-full mb-3" />
                                   <div className="h-2 w-20 bg-slate-800 rounded-full" />
                                </div>
                                <div className="text-right">
                                   <div className="h-4 w-12 bg-primary/20 rounded-md" />
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
               </div>
               
               {/* Trust Badge */}
               <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-2xl border flex items-center gap-4 animate-float">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-white">
                     <ShieldCheck size={28} />
                  </div>
                  <div>
                     <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Verification</p>
                     <p className="text-sm font-bold text-gray-900">Security Level: Enterprise</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-16 border-b bg-slate-50/50">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Trusted by Global Philanthropies & Corporate Teams</p>
            <div className="flex flex-wrap justify-center items-center gap-20 opacity-40 grayscale contrast-125">
               <div className="text-2xl font-black tracking-tighter">HUMANITY.CO</div>
               <div className="text-2xl font-black italic">GLOBAL AID</div>
               <div className="text-2xl font-black tracking-widest underline decoration-primary decoration-4 underline-offset-8">VIRTUE</div>
               <div className="text-2xl font-black">AMPLIFY</div>
               <div className="text-2xl font-black tracking-tight italic">UNITED.FUND</div>
            </div>
         </div>
      </section>

      {/* Core Solutions Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">Tools built for the scale of your impact.</h2>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              Whether you're a registered charity or a corporate CSR team, Momentri provides the professional infrastructure you need to drive results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* For Charities */}
            <div className="group p-12 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <HandHeart size={40} />
              </div>
              <h3 className="text-2xl font-black mb-6 text-slate-900 tracking-tight">Registered Charities</h3>
              <p className="text-slate-600 leading-relaxed mb-10 font-medium text-lg">
                Automate tax receipts, manage verified registries for specific projects, and maintain donor trust with bank-level security.
              </p>
              <ul className="space-y-5">
                 {['Verified Registry Items', 'Low 2.5% Platform Fees', 'Automated Tax Compliance'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                       <CheckCircle2 size={18} className="text-primary" /> {item}
                    </li>
                 ))}
              </ul>
            </div>

            {/* For Corporations */}
            <div className="group p-12 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <Briefcase size={40} />
              </div>
              <h3 className="text-2xl font-black mb-6 text-slate-900 tracking-tight">Corporate Giving</h3>
              <p className="text-slate-600 leading-relaxed mb-10 font-medium text-lg">
                Engage employees with matched giving, team challenges, and beautiful project dashboards for your annual impact report.
              </p>
              <ul className="space-y-5">
                 {['Employee Matching Logic', 'CSR Impact Reporting', 'Team Leaderboards'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                       <CheckCircle2 size={18} className="text-blue-500" /> {item}
                    </li>
                 ))}
              </ul>
            </div>

            {/* Analytics */}
            <div className="group p-12 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2">
              <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <BarChart3 size={40} />
              </div>
              <h3 className="text-2xl font-black mb-6 text-slate-900 tracking-tight">Radical Transparency</h3>
              <p className="text-slate-600 leading-relaxed mb-10 font-medium text-lg">
                Real-time tracking of every dollar. Detailed analytics that tell the story of your impact to stakeholders and donors.
              </p>
              <ul className="space-y-5">
                 {['Real-time Dashboards', 'API Data Access', 'Custom White-labeling'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                       <CheckCircle2 size={18} className="text-slate-900" /> {item}
                    </li>
                 ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail Section */}
      <section className="py-32 bg-slate-50 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-32 items-center mb-32">
               <div>
                  <div className="inline-flex items-center gap-2 text-primary font-black uppercase text-xs tracking-[0.2em] mb-8">
                     <Gift size={20} fill="currentColor" />
                     Impact Registries
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight tracking-tight">Direct action through project-specific registries.</h2>
                  <p className="text-xl text-slate-600 mb-12 leading-relaxed font-medium">
                     Move beyond just cash. Organizations can curate lists of specific items needed for a project—whether it's medical supplies for a clinic or equipment for a local school. Donors see exactly where their contribution goes.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="p-6 bg-white rounded-3xl border shadow-sm">
                        <CheckCircle2 className="text-green-500 mb-4" size={24} />
                        <p className="font-black text-slate-900 mb-2">Item Verification</p>
                        <p className="text-sm text-slate-500 font-medium">Ensure every registry item is vetted and necessary.</p>
                     </div>
                     <div className="p-6 bg-white rounded-3xl border shadow-sm">
                        <Users className="text-blue-500 mb-4" size={24} />
                        <p className="font-black text-slate-900 mb-2">Social Sharing</p>
                        <p className="text-sm text-slate-500 font-medium">Viral tools to expand your organization's reach.</p>
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
                  {/* Decorative */}
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
               </div>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-32 items-center">
               <div className="order-2 lg:order-1 relative">
                  <div className="rounded-[4rem] overflow-hidden shadow-3xl -rotate-2 hover:rotate-0 transition-transform duration-700">
                     <img 
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" 
                        alt="Corporate team collaboration" 
                        className="w-full aspect-[4/5] object-cover scale-110 hover:scale-100 transition-transform duration-700"
                     />
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
               </div>
               <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-[0.2em] mb-8">
                     <Globe size={20} fill="currentColor" />
                     Enterprise Security
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight tracking-tight">Scale securely across your entire organization.</h2>
                  <p className="text-xl text-slate-600 mb-12 leading-relaxed font-medium">
                     Momentri is built on top of world-class infrastructure. We provide the security, compliance, and permission controls required for large-scale corporate environments and sensitive philanthropic data.
                  </p>
                  
                  <ul className="space-y-6">
                     {[
                        { title: 'SSO Integration', desc: 'Seamless access via Okta, Azure AD, or Google Workspace.' },
                        { title: 'Role-based Access', desc: 'Granular permissions for team members and auditors.' },
                        { title: 'Data Sovereignty', desc: 'Full control over your organizational and donor data.' }
                     ].map((item, i) => (
                        <li key={i} className="flex gap-5">
                           <div className="w-10 h-10 rounded-full bg-slate-900 flex-shrink-0 flex items-center justify-center text-white">
                              <Zap size={18} fill="currentColor" />
                           </div>
                           <div>
                              <p className="font-black text-slate-900">{item.title}</p>
                              <p className="text-slate-500 font-medium text-sm">{item.desc}</p>
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               {[
                  { label: 'Global Charities', value: '450+' },
                  { label: 'Impact Projects', value: '2.5k+' },
                  { label: 'Donor Retention', value: '78%' },
                  { label: 'Platform Uptime', value: '99.9%' }
               ].map((stat, i) => (
                  <div key={i} className="text-center">
                     <p className="text-5xl font-black text-slate-900 mb-3">{stat.value}</p>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[4rem] p-16 md:p-28 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
               <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tight leading-tight">Ready to amplify <br /> your organization's impact?</h2>
               <p className="text-xl text-slate-400 mb-14 font-medium leading-relaxed">
                 Join the next generation of organizations using Momentri to create meaningful change. Verification takes less than 24 hours.
               </p>
               <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-12 py-6 text-xl font-bold text-primary-foreground shadow-2xl shadow-primary/40 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                  >
                    Get Started Now
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-white/5 border border-white/20 px-12 py-6 text-xl font-bold text-white transition-all hover:bg-white/10"
                  >
                    Contact Sales
                  </Link>
               </div>
               <p className="mt-12 text-sm text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                  <ShieldCheck size={18} className="text-green-500" />
                  No credit card required to start
               </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default B2B;
