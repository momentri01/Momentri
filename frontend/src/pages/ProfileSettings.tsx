import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { User, Mail, Phone, MapPin, Shield, Camera, Loader2, Save } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    phoneNumber: '',
    deliveryAddress: '',
    country: 'United States',
    province: ''
  });

  const provinces = {
    'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
    'Canada': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon']
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get('/users/profile');
        setProfile(data);
        setFormData({
          fullName: data.fullName || '',
          bio: data.bio || '',
          phoneNumber: data.phoneNumber || '',
          deliveryAddress: data.deliveryAddress || '',
          country: data.country || 'United States',
          province: data.province || provinces['United States'][0],
        });
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newData = { ...formData, [name]: value };
    if (name === 'country') {
        newData.province = provinces[value as keyof typeof provinces][0];
    }
    setFormData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.put('/users/profile', formData);
      setProfile(updated);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
        <div className="flex items-center gap-6 mb-8">
           <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
              <User size={40} />
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full"><Camera size={14} /></button>
           </div>
           <div>
              <h2 className="text-xl font-bold">{profile?.fullName}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-bold mb-2">Country</label>
              <select name="country" value={formData.country} onChange={handleChange} className="w-full rounded-xl border p-3">
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
              </select>
           </div>
           <div>
              <label className="block text-sm font-bold mb-2">{formData.country === 'Canada' ? 'Province' : 'State'}</label>
              <select name="province" value={formData.province} onChange={handleChange} className="w-full rounded-xl border p-3">
                  {provinces[formData.country as keyof typeof provinces].map(p => (
                      <option key={p} value={p}>{p}</option>
                  ))}
              </select>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-bold mb-2">Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full rounded-xl border p-3" />
           </div>
           <div>
              <label className="block text-sm font-bold mb-2">Phone Number</label>
              <input name="phoneNumber" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="w-full rounded-xl border p-3" />
           </div>
        </div>

        <div>
           <label className="block text-sm font-bold mb-2">Bio</label>
           <textarea name="bio" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={3} className="w-full rounded-xl border p-3" />
        </div>

        <div>
           <label className="block text-sm font-bold mb-2">Delivery Address</label>
           <textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={e => setFormData({...formData, deliveryAddress: e.target.value})} rows={2} className="w-full rounded-xl border p-3" />
        </div>

        <button type="submit" disabled={saving} className="bg-primary text-white px-8 py-3 rounded-full font-bold flex items-center gap-2">
           {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
           Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
