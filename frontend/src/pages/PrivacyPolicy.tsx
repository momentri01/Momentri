import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield size={32} />
           </div>
           <h1 className="text-4xl font-black text-gray-900 mb-4">Privacy Policy</h1>
           <p className="text-muted-foreground font-bold">Last updated: February 28, 2026</p>
        </div>

        <div className="prose prose-blue max-w-none space-y-12">
           <section>
              <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                 <Lock size={24} className="text-primary" />
                 1. Data We Collect
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                 We collect information you provide directly to us when you create an account, launch an event, or make a donation. This includes your name, email address, password, delivery address (for registry hosts), and payment information.
              </p>
           </section>

           <section>
              <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                 <Eye size={24} className="text-primary" />
                 2. How We Use Your Data
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                 We use your information to facilitate donations, manage gift registries, and process payouts. Specifically, delivery addresses provided by event hosts are **strictly private** and are only used by Momentris's internal fulfillment team to ship physical gifts.
              </p>
           </section>

           <section className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                 <Shield size={20} className="text-green-600" />
                 Special Note on Registry Privacy
              </h3>
              <p className="text-sm text-gray-600 font-bold leading-relaxed">
                 Donors and supporters never see the delivery address of an event host. When an item is purchased from a registry, the fulfillment is handled entirely by Momentris and our logistics partners. Your location is never displayed on public event pages.
              </p>
           </section>

           <section>
              <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                 <FileText size={24} className="text-primary" />
                 3. Third-Party Sharing
              </h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                 We do not sell your personal information. We share data with third-party service providers (like Stripe for payments or shipping carriers) only as necessary to perform platform functions.
              </p>
           </section>

           <section className="pt-12 border-t text-center">
              <p className="text-muted-foreground text-sm font-medium">
                 If you have questions about our privacy practices, please contact us at <span className="text-primary font-bold">privacy@momentriss.com</span>.
              </p>
           </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
