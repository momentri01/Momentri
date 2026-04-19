import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Globe,
  HandHeart,
  Briefcase,
  FileText
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
                Momentris for Organizations
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05] mb-8 text-balance">
                Scale your mission with <span className="text-primary italic">professional fundraising.</span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed mb-12 max-w-2xl">
                The enterprise-grade platform for charities and nonprofits to raise funds, manage donors, and issue tax receipts with radical transparency.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:bg-primary/90 hover:-translate-y-1 active:translate-y-0"
                >
                  Create Organization Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-white/5 border border-white/20 px-10 py-5 text-lg font-bold text-white shadow-sm transition-all hover:bg-white/10 backdrop-blur-sm"
                >
                  Contact for Inquiries
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
                       <div className="px-4 py-1.5 rounded-full bg-slate-800/80 text-[10px] font-bold text-slate-400 tracking-widest uppercase border border-white/5">Impact Portal</div>
                    </div>
                    
                    <div className="space-y-8">
                       <div className="grid grid-cols-1 gap-5">
                          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Platform Verification</p>
                             <div className="flex items-center justify-center gap-2 text-primary">
                                <ShieldCheck size={24} />
                                <p className="text-xl font-black text-white uppercase italic">Verified Charity</p>
                             </div>
                          </div>
                       </div>
                       
                       <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                          <div className="flex justify-between items-center mb-5">
                             <p className="font-bold text-slate-200 text-sm">Campaign Progress</p>
                             <p className="text-primary font-black text-sm">Live</p>
                          </div>
                          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-1">
                             <div className="h-full bg-primary w-[75%] rounded-full shadow-[0_0_25px_rgba(var(--primary),0.6)] animate-pulse" />
                          </div>
                       </div>

                       <div className="space-y-4">
                          {[1, 2].map(i => (
                             <div key={i} className="flex items-center gap-5 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                   <FileText size={24} />
                                </div>
                                <div className="flex-1">
                                   <div className="h-2.5 w-32 bg-slate-700 rounded-full mb-3" />
                                   <div className="h-2 w-20 bg-slate-800 rounded-full" />
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Solutions Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">Professional tools for your cause.</h2>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              Whether you're a registered charity or a corporate CSR team, Momentris provides the infrastructure to manage donations and demonstrate impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* For Charities */}
            <div className="group p-12 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <HandHeart size={40} />
              </div>
              <h3 className="text-2xl font-black mb-6 text-slate-900 tracking-tight">Charity Verification</h3>
              <p className="text-slate-600 leading-relaxed mb-10 font-medium text-lg">
                Showcase your registration status and gain donor trust with our verified organization badge.
              </p>
              <ul className="space-y-5">
                 {['Registration Number Display', 'Verified Trust Badge', 'Official Donor Receipts'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                       <CheckCircle2 size={18} className="text-primary" /> {item}
                    </li>
                 ))}
              </ul>
            </div>

            {/* Tax Receipts */}
            <div className="group p-12 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                <FileText size={40} />
              </div>
              <h3 className="text-2xl font-black mb-6 text-slate-900 tracking-tight">Tax Receipts</h3>
              <p className="text-slate-600 leading-relaxed mb-10 font-medium text-lg">
                Registered charities can issue official tax receipts directly through the platform, simplifying the donation process.
              </p>
              <ul className="space-y-5">
                 {['Automated Emailing', 'Custom Branding', 'Compliance Ready'].map(item => (
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
              <h3 className="text-2xl font-black mb-6 text-slate-900 tracking-tight">Impact Tracking</h3>
              <p className="text-slate-600 leading-relaxed mb-10 font-medium text-lg">
                Real-time tracking of every dollar. Detailed analytics to share with your board and supporters.
              </p>
              <ul className="space-y-5">
                 {['Real-time Dashboards', 'Donor Management', 'Exportable Reports'].map(item => (
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
            <div className="lg:grid lg:grid-cols-2 lg:gap-32 items-center">
               <div>
                  <div className="inline-flex items-center gap-2 text-primary font-black uppercase text-xs tracking-[0.2em] mb-8">
                     <ShieldCheck size={20} fill="currentColor" />
                     Trust & Safety
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight tracking-tight">A platform built for organizational trust.</h2>
                  <p className="text-xl text-slate-600 mb-12 leading-relaxed font-medium">
                     We understand the importance of accountability. Momentris provides the specialized tools charities need to operate professionally and securely.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <div className="p-6 bg-white rounded-3xl border shadow-sm">
                        <CheckCircle2 className="text-green-500 mb-4" size={24} />
                        <p className="font-black text-slate-900 mb-2">Nonprofit Vetting</p>
                        <p className="text-sm text-slate-500 font-medium">Ensuring every organization is legitimate.</p>
                     </div>
                     <div className="p-6 bg-white rounded-3xl border shadow-sm">
                        <Users className="text-blue-500 mb-4" size={24} />
                        <p className="font-black text-slate-900 mb-2">Donor Privacy</p>
                        <p className="text-sm text-slate-500 font-medium">Bank-grade security for your supporters.</p>
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
                 Join the growing number of organizations using Momentris to create meaningful change.
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

export default B2B;
