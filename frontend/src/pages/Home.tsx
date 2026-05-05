import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Search, Calendar, MapPin, Heart, Users, Target, PartyPopper, Baby, Cross, GraduationCap, Stethoscope, LayoutGrid, Cake } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  eventDate: string;
  donationGoal: number;
  totalDonationsNet: number;
  slug: string;
  country: string;
  province?: string;
  currency: string;
  coverImageUrl: string;
  owner: { fullName: string };
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Birthday', icon: Cake },
    { name: 'Wedding', icon: PartyPopper },
    { name: 'Baby Shower', icon: Baby },
    { name: 'Memorial', icon: Cross },
    { name: 'Graduation', icon: GraduationCap },
    { name: 'Medical Emergency', icon: Stethoscope },
    { name: 'Other', icon: Heart },
  ];

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        const data = await api.get('/events/public');
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch public events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.eventType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search & Filter Header */}
      <div className="bg-white border-b sticky top-16 z-40 pt-12 pb-6 px-4">
        <div className="max-w-7xl mx-auto text-center mb-8">
           <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Discover fundraisers</h1>
           <p className="text-muted-foreground font-medium mb-8">Browse by category or search for specific causes.</p>
           
           <div className="max-w-2xl mx-auto relative group mb-10">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by cause, name, or story..."
                className="w-full rounded-full border-2 border-gray-100 bg-white pl-16 pr-8 py-5 text-lg shadow-sm focus:border-primary focus:ring-0 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           {/* Category Filters */}
           <div className="flex items-center justify-center gap-3 overflow-x-auto pb-4 no-scrollbar">
              {categories.map((cat) => (
                 <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all whitespace-nowrap font-black text-xs uppercase tracking-widest ${
                       selectedCategory === cat.name 
                       ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                       : 'bg-white border-gray-100 text-gray-500 hover:border-primary/30 hover:text-primary'
                    }`}
                 >
                    <cat.icon size={16} />
                    {cat.name}
                 </button>
              ))}
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border shadow-sm border-dashed">
            <Heart size={64} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-black text-gray-900">No {selectedCategory !== 'All' ? selectedCategory : ''} fundraisers found</h3>
            <p className="text-muted-foreground font-medium">Try searching for something else or browse another category.</p>
            {selectedCategory !== 'All' && (
               <button 
                  onClick={() => setSelectedCategory('All')}
                  className="mt-6 text-primary font-black uppercase tracking-widest text-xs hover:underline"
               >
                  View All Causes
               </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEvents.map((event) => {
               const progress = Math.min((Number(event.totalDonationsNet) / Number(event.donationGoal)) * 100, 100);
               return (
                  <Link 
                    key={event.id} 
                    to={`/public-event/${event.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col border border-gray-100"
                  >
                    {/* Event Image */}
                    <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
                      {event.coverImageUrl ? (
                         <img src={event.coverImageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-primary/20">
                            <Heart size={64} fill="currentColor" />
                         </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary shadow-lg border border-primary/10">
                          {event.eventType}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-1 leading-tight">{event.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-8 font-medium flex-1">{event.description}</p>
                      
                      <div className="mt-auto space-y-6">
                        {/* Progress Bar */}
                        <div>
                          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.3)]" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-end">
                             <p className="text-sm font-black text-gray-900">
                                {event.currency} {Number(event.totalDonationsNet).toLocaleString()}
                                <span className="text-xs text-muted-foreground font-bold ml-1 uppercase tracking-tighter">raised</span>
                             </p>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Goal: {event.currency} {Number(event.donationGoal).toLocaleString()}
                             </p>
                          </div>
                        </div>

                        {/* Footer Info */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <Users size={12} className="text-gray-400" />
                             </div>
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">by {event.owner.fullName.split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest">
                            <MapPin size={12} />
                            {event.province ? `${event.province}, ` : ''}{event.country}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
