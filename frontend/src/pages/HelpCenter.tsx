import React from 'react';
import { Search, Book, Shield, CreditCard, Gift, Users, MessageCircle } from 'lucide-react';

const HelpCenter: React.FC = () => {
  const categories = [
    { title: 'Getting Started', icon: Book, items: ['How to create an event', 'Setting your first goal', 'Customizing your event page'] },
    { title: 'Donations & Payouts', icon: CreditCard, items: ['Accepted payment methods', 'How to request a withdrawal', 'Payout timelines'] },
    { title: 'Gift Registry', icon: Gift, items: ['Adding items to your registry', 'Fulfillment & shipping', 'International delivery'] },
    { title: 'Privacy & Security', icon: Shield, items: ['Protecting your address', 'Payment security', 'Account verification'] },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-primary/5 py-24">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8">How can we help?</h1>
            <div className="max-w-2xl mx-auto relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
               <input 
                  className="w-full rounded-full border-2 border-gray-100 bg-white pl-16 pr-8 py-6 text-lg shadow-xl focus:border-primary focus:ring-0 transition-all"
                  placeholder="Search for articles, guides, and more..."
               />
            </div>
         </div>
      </section>

      {/* Categories */}
      <section className="py-24">
         <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {categories.map((cat) => (
                  <div key={cat.title} className="p-8 rounded-[2rem] border bg-white hover:shadow-xl transition-all group">
                     <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                        <cat.icon size={24} />
                     </div>
                     <h3 className="text-xl font-black mb-4">{cat.title}</h3>
                     <ul className="space-y-3">
                        {cat.items.map(item => (
                           <li key={item}><button className="text-sm text-muted-foreground hover:text-primary font-medium text-left">{item}</button></li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50/50">
         <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-6">
               {[
                  { q: 'Is my delivery address shared with donors?', a: 'No. Your delivery address is strictly private and only visible to Momentris administrators for the purpose of shipping registry items to you.' },
                  { q: 'How long do withdrawals take?', a: 'Withdrawal requests are typically reviewed within 24 hours and processed within 1-3 business days depending on your payout method.' },
                  { q: 'What fees does Momentris charge?', a: 'We charge a flat 10% platform fee on all successful transactions. There are no monthly costs or hidden setup fees.' }
               ].map((faq, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border shadow-sm">
                     <h4 className="font-black text-gray-900 mb-2">{faq.q}</h4>
                     <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <MessageCircle size={32} />
            </div>
            <h2 className="text-3xl font-black mb-4">Still need help?</h2>
            <p className="text-muted-foreground font-medium mb-8">Our support team is available 24/7 to assist you with any questions.</p>
            <button className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
               Chat with Support
            </button>
         </div>
      </section>
    </div>
  );
};

export default HelpCenter;
