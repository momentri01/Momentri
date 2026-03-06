import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';

const ContactUs: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight">Let's talk.</h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Have a question about a campaign? Need help with your gift registry? 
              Our team is here to support you every step of the way.
            </p>

            <div className="space-y-10">
               <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                     <Mail size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                     <p className="text-muted-foreground font-medium">support@momentri.com</p>
                     <p className="text-xs text-gray-400 mt-1">Typical response time: 2 hours</p>
                  </div>
               </div>
               <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                     <MessageSquare size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-900 mb-1">Live Chat</h4>
                     <p className="text-muted-foreground font-medium">Available Mon-Fri, 9am - 6pm EST</p>
                  </div>
               </div>
               <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                     <MapPin size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-900 mb-1">Headquarters</h4>
                     <p className="text-muted-foreground font-medium text-sm">
                        123 Fundraising Way, Suite 500<br />
                        San Francisco, CA 94103
                     </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-16 lg:mt-0">
             <div className="bg-gray-50 p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm">
                <form className="space-y-6">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-bold mb-2">First Name</label>
                         <input className="w-full rounded-2xl border-gray-200 bg-white px-4 py-3 focus:ring-primary focus:border-primary" placeholder="Jane" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold mb-2">Last Name</label>
                         <input className="w-full rounded-2xl border-gray-200 bg-white px-4 py-3 focus:ring-primary focus:border-primary" placeholder="Doe" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-bold mb-2">Email Address</label>
                      <input className="w-full rounded-2xl border-gray-200 bg-white px-4 py-3 focus:ring-primary focus:border-primary" placeholder="jane@example.com" type="email" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold mb-2">Subject</label>
                      <select className="w-full rounded-2xl border-gray-200 bg-white px-4 py-3 focus:ring-primary focus:border-primary font-medium">
                         <option>General Inquiry</option>
                         <option>Technical Support</option>
                         <option>Billing & Payouts</option>
                         <option>Registry Questions</option>
                         <option>Partnerships</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold mb-2">Message</label>
                      <textarea className="w-full rounded-2xl border-gray-200 bg-white px-4 py-3 focus:ring-primary focus:border-primary" rows={5} placeholder="How can we help?" />
                   </div>
                   <button className="w-full inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all gap-2">
                      Send Message
                      <Send size={18} />
                   </button>
                </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
