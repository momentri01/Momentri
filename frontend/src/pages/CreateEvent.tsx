import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Calendar, Target, Globe, Lock, ArrowLeft, ArrowRight, CheckCircle2, Gift, Plus, Minus, Search, MapPin, ShieldCheck, X, Image as ImageIcon, Upload, Loader2, ChevronRight, Package } from 'lucide-react';

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  imageUrls: string[] | string;
}

interface SelectedItem {
  catalogItemId: string;
  quantityRequested: number;
  name: string;
  price: number;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showAddressPrompt, setShowAddressPrompt] = useState(false);
  const [tempAddress, setTempAddress] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'Wedding',
    eventDate: '',
    donationGoal: '',
    currency: 'USD',
    visibility: 'PUBLIC',
    country: 'United States',
    coverImageUrl: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catalogData, profileData] = await Promise.all([
          api.get('/catalog'),
          api.get('/users/profile')
        ]);
        setCatalog(catalogData);
        setUserProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setVisibility = (value: string) => {
    setFormData({ ...formData, visibility: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: uploadData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setFormData({ ...formData, coverImageUrl: data.imageUrl });
    } catch (error) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const toggleItem = (item: CatalogItem) => {
    const exists = selectedItems.find(i => i.catalogItemId === item.id);
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.catalogItemId !== item.id));
    } else {
      setSelectedItems([...selectedItems, { catalogItemId: item.id, quantityRequested: 1, name: item.name, price: item.price }]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedItems(selectedItems.map(i => 
      i.catalogItemId === itemId ? { ...i, quantityRequested: Math.max(1, i.quantityRequested + delta) } : i
    ));
  };

  const handleNextStep = () => {
    if (step === 2 && !userProfile?.deliveryAddress) {
      setShowAddressPrompt(true);
    } else {
      setStep(step + 1);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.put('/users/profile', { deliveryAddress: tempAddress });
      setUserProfile(updated);
      setShowAddressPrompt(false);
      setStep(3);
    } catch (error) {
      alert('Failed to save address');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const event = await api.post('/events', {
        ...formData,
        donationGoal: parseFloat(formData.donationGoal),
        wishlistItems: selectedItems.map(({ catalogItemId, quantityRequested }) => ({
          catalogItemId,
          quantityRequested
        }))
      });
      navigate(`/manage-event?id=${event.id}`);
    } catch (error) {
      alert('Error creating event. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCatalog = catalog.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (formData.eventType === 'Other') return matchesSearch;
    
    return matchesSearch && item.category.toLowerCase() === formData.eventType.toLowerCase();
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2 text-center">Create your event</h1>
        <p className="text-muted-foreground text-center">Tell us about your cause and set your goals.</p>
        
        {/* Progress Bar */}
        <div className="mt-8 flex items-center justify-between relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300" 
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`relative z-10 flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm transition-colors duration-300 ${
                step >= s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > s ? <CheckCircle2 size={16} /> : s}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-2xl mx-auto mt-2 px-2">
           <span className="text-[10px] font-bold uppercase text-muted-foreground">Details</span>
           <span className="text-[10px] font-bold uppercase text-muted-foreground">Goal</span>
           <span className="text-[10px] font-bold uppercase text-muted-foreground">Registry</span>
           <span className="text-[10px] font-bold uppercase text-muted-foreground">Launch</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden relative">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold">Step 1: Event Basics</h2>
              <div>
                <label className="block text-sm font-bold mb-2">Event Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full rounded-xl border-border bg-muted/20 px-4 py-3 focus:ring-primary font-medium"
                  placeholder="e.g. Sarah & James' Wedding"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Event Type</label>
                <select
                  name="eventType"
                  className="w-full rounded-xl border-border bg-muted/20 px-4 py-3 focus:ring-primary font-medium"
                  value={formData.eventType}
                  onChange={handleChange}
                >
                  <option>Birthday</option>
                  <option>Wedding</option>
                  <option>Baby Shower</option>
                  <option>Memorial</option>
                  <option>Graduation</option>
                  <option>Medical Emergency</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900">Event Cover Image</label>
                <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept="image/*" 
                   onChange={handleFileChange}
                />
                
                <div 
                   onClick={() => fileInputRef.current?.click()}
                   className={`relative w-full aspect-[16/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                      formData.coverImageUrl ? 'border-primary' : 'border-gray-200 hover:border-primary bg-gray-50'
                   }`}
                >
                   {formData.coverImageUrl ? (
                      <>
                         <img src={formData.coverImageUrl} className="w-full h-full object-cover" alt="Preview" />
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white font-bold flex items-center gap-2"><Upload size={20}/> Change Image</p>
                         </div>
                      </>
                   ) : (
                      <>
                         {uploading ? (
                            <div className="text-center">
                               <Loader2 className="animate-spin text-primary mx-auto mb-2" size={32} />
                               <p className="text-sm font-bold text-gray-500">Uploading image...</p>
                            </div>
                         ) : (
                            <div className="text-center p-8">
                               <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Upload size={24} />
                               </div>
                               <p className="font-bold text-gray-900 mb-1">Click to upload photo</p>
                               <p className="text-xs text-muted-foreground font-medium">JPEG, PNG or WebP (max 5MB)</p>
                            </div>
                         )}
                      </>
                   )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="w-full rounded-xl border-border bg-muted/20 px-4 py-3 focus:ring-primary font-medium"
                  placeholder="Tell your story..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Next Step
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold">Step 2: Financial Goals</h2>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-bold mb-2">Donation Goal</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">{formData.currency}</span>
                    <input
                      type="number"
                      name="donationGoal"
                      required
                      className="w-full rounded-xl border-border bg-muted/20 pl-10 pr-4 py-3 focus:ring-primary font-bold"
                      placeholder="0.00"
                      value={formData.donationGoal}
                      onChange={handleChange}
                    />
                    </div>
                    {Number(formData.donationGoal) >= 10000 && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                       <ShieldCheck className="text-blue-600 shrink-0" size={18} />
                       <div className="text-[10px] leading-relaxed text-blue-800 font-bold">
                          <p className="uppercase tracking-widest mb-1">Verification Required</p>
                          <p className="font-medium text-blue-700/80">Goals over $10,000 require platform verification. Once approved, your event will receive a verified badge to build donor trust.</p>
                       </div>
                    </div>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Currency</label>
                  <select
                    name="currency"
                    className="w-full rounded-xl border-border bg-muted/20 px-4 py-3 focus:ring-primary font-bold"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option>USD</option>
                    <option>GHS</option>
                    <option>NGN</option>
                    <option>KES</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Event Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="date"
                    name="eventDate"
                    required
                    className="w-full rounded-xl border-border bg-muted/20 pl-12 pr-4 py-3 focus:ring-primary font-medium"
                    value={formData.eventDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                 <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-muted px-8 py-4 text-base font-bold transition-all hover:bg-muted/80"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90"
                >
                  Configure Registry
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-xl font-bold">Step 3: Gift Registry (Optional)</h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                       <ShieldCheck size={14} className="text-green-600" />
                       Your delivery address is private and only visible to site admins.
                    </p>
                 </div>
                 <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {selectedItems.length} items selected
                 </span>
              </div>
              
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                 <input 
                    className="w-full rounded-xl border border-border bg-muted/10 pl-10 pr-4 py-2 text-sm font-medium"
                    placeholder="Search catalog..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {filteredCatalog.map((item) => {
                    const selected = selectedItems.find(i => i.catalogItemId === item.id);
                    const images = Array.isArray(item.imageUrls) ? item.imageUrls : JSON.parse(typeof item.imageUrls === 'string' ? item.imageUrls : '[]');
                    return (
                       <div 
                          key={item.id} 
                          onClick={() => toggleItem(item)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                             selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-white hover:border-primary/50'
                          }`}
                       >
                          <div>
                             <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-muted/20 relative">
                                {images.length > 0 ? (
                                   <>
                                      <img src={images[0]} className="w-full h-full object-cover" alt={item.name} />
                                      {images.length > 1 && (
                                         <div className="absolute bottom-1.5 right-1.5 bg-black/50 backdrop-blur-sm text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                                            +{images.length - 1}
                                         </div>
                                      )}
                                   </>
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                                      <Package size={24} />
                                   </div>
                                )}
                             </div>
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.category}</span>
                                <p className="font-black text-primary">${item.price}</p>
                             </div>
                             <p className="font-bold text-sm mb-1">{item.name}</p>
                             <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                          </div>
                          
                          {selected && (
                             <div className="mt-4 flex items-center justify-between bg-white rounded-lg p-1 border shadow-sm" onClick={(e) => e.stopPropagation()}>
                                <button type="button" onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-muted rounded transition-colors"><Minus size={14}/></button>
                                <span className="text-xs font-black">{selected.quantityRequested}</span>
                                <button type="button" onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-muted rounded transition-colors"><Plus size={14}/></button>
                             </div>
                          )}
                       </div>
                    );
                 })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                 <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-muted px-8 py-4 text-base font-bold transition-all hover:bg-muted/80"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 shadow-lg"
                >
                  {selectedItems.length > 0 ? 'Continue to Launch' : 'Skip Registry & Launch'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold">Step 4: Final Launch</h2>
              <div>
                <label className="block text-sm font-bold mb-2">Visibility</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setVisibility('PUBLIC')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all group ${
                      formData.visibility === 'PUBLIC' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 hover:border-primary/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-colors ${formData.visibility === 'PUBLIC' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:text-primary'}`}>
                       <Globe size={20} />
                    </div>
                    <p className={`font-black text-sm uppercase tracking-widest ${formData.visibility === 'PUBLIC' ? 'text-primary' : 'text-gray-500'}`}>Public</p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Visible to everyone in browse results.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility('PRIVATE')}
                    className={`p-6 rounded-2xl border-2 text-left transition-all group ${
                      formData.visibility === 'PRIVATE' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 hover:border-primary/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-colors ${formData.visibility === 'PRIVATE' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:text-primary'}`}>
                       <Lock size={20} />
                    </div>
                    <p className={`font-black text-sm uppercase tracking-widest ${formData.visibility === 'PRIVATE' ? 'text-primary' : 'text-gray-500'}`}>Private</p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Only visible to people with the link.</p>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  required
                  className="w-full rounded-xl border-border bg-muted/20 px-4 py-3 focus:ring-primary font-medium"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-4 pt-4">
                 <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-muted px-8 py-4 text-base font-bold transition-all hover:bg-muted/80"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Launch Event'}
                  {!loading && <CheckCircle2 className="ml-2 h-5 w-5" />}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Address Modal */}
        {showAddressPrompt && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddressPrompt(false)} />
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 w-full max-w-lg relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
                 <div className="text-center mb-8">
                    <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                       <MapPin size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Delivery Address Required</h2>
                    <p className="text-muted-foreground text-sm font-medium">We need your address to fulfill any registry items purchased by your supporters.</p>
                 </div>

                 <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-8 flex gap-3 items-start text-left">
                    <ShieldCheck className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
                    <p className="text-xs text-green-800 font-bold leading-relaxed">
                       Privacy Guarantee: Your address is never shared with donors or displayed publicly. It is only used by Momentri staff for shipping.
                    </p>
                 </div>

                 <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div>
                       <label className="block text-sm font-bold mb-2">Full Delivery Address</label>
                       <textarea
                          required
                          className="w-full rounded-xl border-border bg-muted/20 px-4 py-3 focus:ring-primary font-medium"
                          rows={3}
                          placeholder="House No, Street Name, City, State, Country"
                          value={tempAddress}
                          onChange={(e) => setTempAddress(e.target.value)}
                       />
                    </div>
                    <div className="flex flex-col gap-3">
                       <button className="w-full inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
                          Save and Continue
                       </button>
                       <button 
                          type="button"
                          onClick={() => {
                             setShowAddressPrompt(false);
                             setStep(4); // Skip to launch if they don't want a registry
                          }}
                          className="w-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
                       >
                          I don't need a registry, skip this <ChevronRight size={14}/>
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
