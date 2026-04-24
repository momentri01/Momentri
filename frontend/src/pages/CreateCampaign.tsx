import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Calendar, ArrowRight, Plus, Upload, Loader2, ShieldCheck, HandHeart, MapPin } from 'lucide-react';

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const organizationId = user?.userId; // Assuming userId holds organizationId

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    campaignGoal: '',
    currency: 'USD',
    startDate: '',
    endDate: '',
  });

  const countries = ["United States", "Canada"];
  const provinces = {
    "United States": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
    "Canada": ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"]
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newData = { ...formData, [name]: value };

    if (name === 'country') {
      newData.currency = value === 'Canada' ? 'CAD' : 'USD';
      // Reset province when country changes
      newData.province = provinces[value as keyof typeof provinces][0] || ''; 
    }
    
    setFormData(newData);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001/api'; // Use env variable
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: uploadData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setCoverImageUrl(data.imageUrl); // Assuming single image upload for cover
    } catch (error) {
      alert('Failed to upload image. Please try again.');
      console.error('Image upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!organizationId) throw new Error("Organization ID missing.");

      await api.post('/campaigns', {
        ...formData,
        campaignGoal: parseFloat(formData.campaignGoal),
        organizationId: organizationId, // Ensure organizationId is sent
      });
      navigate('/dashboard'); // Redirect to dashboard after success
      alert('Campaign created successfully!');
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      alert(`Failed to create campaign: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black mb-4 text-gray-900">Create a Fundraising Campaign</h1>
        <p className="text-muted-foreground text-lg font-medium">Share your cause and start collecting donations.</p>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Title */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Campaign Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full rounded-xl border-border bg-muted/20 px-4 py-3 focus:ring-primary font-medium placeholder-shown:text-muted-foreground"
              placeholder="e.g. Build a New Community Center"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Campaign Description */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Description</label>
            <textarea
              name="description"
              required
              rows={5}
              className="w-full rounded-xl border-border bg-muted/20 px-4 py-3 focus:ring-primary font-medium placeholder-shown:text-muted-foreground"
              placeholder="Tell your story and explain your cause..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Campaign Goal and Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">Fundraising Goal</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">{formData.currency}</span>
                <input
                  type="number"
                  name="campaignGoal"
                  required
                  className="w-full rounded-xl border-border bg-muted/20 pl-10 pr-4 py-3 focus:ring-primary font-bold placeholder-shown:text-muted-foreground"
                  placeholder="e.g. 10000.00"
                  value={formData.campaignGoal}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">Currency</label>
              <select
                name="currency"
                className="w-full rounded-xl border-border bg-muted/20 px-4 py-3 focus:ring-primary font-bold"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="USD">United States Dollar (USD)</option>
                <option value="CAD">Canadian Dollar (CAD)</option>
              </select>
            </div>
          </div>

          {/* Country and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">Country</label>
              <select
                name="country"
                className="w-full rounded-xl border-border bg-muted/20 px-4 py-3 focus:ring-primary font-bold"
                value={formData.country}
                onChange={handleChange}
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900">State/Province</label>
              <select
                name="province"
                className="w-full rounded-xl border-border bg-muted/20 px-4 py-3 focus:ring-primary font-bold"
                value={formData.province}
                onChange={handleChange}
              >
                {provinces[formData.country as keyof typeof provinces].map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="date"
                name="startDate"
                required
                className="w-full rounded-xl border-border bg-muted/20 pl-12 pr-4 py-3 focus:ring-primary font-medium"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">End Date (Optional)</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="date"
                name="endDate"
                className="w-full rounded-xl border-border bg-muted/20 pl-12 pr-4 py-3 focus:ring-primary font-medium"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-900">Campaign Cover Image</label>
            <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*" 
               onChange={handleFileChange}
               multiple // Allow multiple images if needed for gallery, but for cover, maybe single is better. Adjust if gallery is required.
            />
            <div 
               onClick={() => fileInputRef.current?.click()}
               className={`relative w-full aspect-video rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all ${
                  coverImageUrl ? 'border-primary' : 'border-dashed border-gray-200 hover:border-primary bg-gray-50'
               }`}
            >
               {uploading ? (
                  <div className="text-center p-8">
                     <Loader2 className="animate-spin text-primary mx-auto mb-2" size={32} />
                     <p className="text-sm font-bold text-gray-500">Uploading image...</p>
                  </div>
               ) : coverImageUrl ? (
                  <>
                     <img src={coverImageUrl} className="w-full h-full object-cover" alt="Cover Preview" />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={(e) => { e.stopPropagation(); setCoverImageUrl(null); }}>
                        <p className="text-white font-bold flex items-center gap-2"><X size={20} /> Remove</p>
                     </div>
                  </>
               ) : (
                  <div className="text-center p-8">
                     <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload size={24} />
                     </div>
                     <p className="font-bold text-gray-900 mb-1">Click to upload cover image</p>
                     <p className="text-xs text-muted-foreground font-medium">JPEG, PNG or WebP (max 5MB)</p>
                  </div>
               )}
            </div>
          </div>

          <div className="pt-8 border-t flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Campaign'}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
