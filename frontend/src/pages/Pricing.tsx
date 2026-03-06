import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Zap, Heart, Gift, Rocket, ShieldCheck } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Simple, transparent pricing.</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            We keep our fees low and our impact high. No hidden costs, ever.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Donation Fees */}
          <div className="bg-gray-50 rounded-[3rem] p-12 border-2 border-transparent hover:border-primary/20 transition-all shadow-sm flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
              Cash Donations
            </div>
            <h3 className="text-3xl font-black mb-4">Direct Giving</h3>
            <p className="text-muted-foreground mb-8 font-medium italic text-sm">For memorials, medical bills, and general support.</p>
            
            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-6xl font-black text-gray-900">10%</span>
              <span className="text-muted-foreground font-black uppercase text-xs tracking-widest">Platform Fee</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {[
                'Instant secure payouts',
                'Mobile Money & Bank support',
                'Automated donor receipts',
                '24/7 Fraud monitoring',
                'Unlimited supporters'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 font-bold text-gray-700 text-sm">
                  <CheckCircle2 className="text-primary" size={18} />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className="w-full inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-black text-primary-foreground shadow-xl hover:bg-primary/90 transition-all"
            >
              Start Donation Pot
            </Link>
          </div>

          {/* Registry Fees - THE CHANGE */}
          <div className="bg-gray-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-green-500/30">
              Gift Registry
            </div>
            <h3 className="text-3xl font-black mb-4">Registry Orders</h3>
            <p className="text-gray-400 mb-8 font-medium italic text-sm">For weddings, baby showers, and birthdays.</p>
            
            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-6xl font-black text-white tracking-tighter">0%</span>
              <span className="text-green-400 font-black uppercase text-xs tracking-widest">Platform Fee</span>
            </div>
            
            <ul className="space-y-4 mb-12 flex-1">
              {[
                'Zero service charges on items',
                'Full item price goes to fulfillment',
                'Curated premium product catalog',
                'Free logistics coordination',
                'Private delivery included'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 font-bold text-gray-300 text-sm">
                  <CheckCircle2 className="text-green-500" size={18} />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className="w-full inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-black text-gray-900 shadow-xl hover:bg-gray-100 transition-all"
            >
              Start Your Registry
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-4xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-black">Frequently Asked Pricing Questions</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border shadow-sm">
                 <h4 className="font-black text-gray-900 mb-2">Why is the Registry 0%?</h4>
                 <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    We partner directly with brands and suppliers. Instead of charging you or your donors a fee, we receive a small commission from the brands themselves. This keeps the registry free for everyone!
                 </p>
              </div>
              <div className="bg-white p-8 rounded-3xl border shadow-sm">
                 <h4 className="font-black text-gray-900 mb-2">What does the 10% fee cover?</h4>
                 <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    The donation fee covers payment processing, 24/7 technical support, server maintenance, and the infrastructure required to move funds securely to your bank or mobile wallet.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
