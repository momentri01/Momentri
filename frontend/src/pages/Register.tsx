import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { HandHeart, User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const provinces: Record<string, string[]> = {
    'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
    'Canada': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon']
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'United States',
    province: 'Alabama',
    businessName: '',
    registrationNumber: '',
    isCharity: false,
    role: 'USER'
  });

  const [activeTab, setActiveTab] = useState<'individual' | 'organization'>('individual');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const type = e.target instanceof HTMLInputElement ? e.target.type : 'text';
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;
    
    let newData = { ...formData, [name]: type === 'checkbox' ? checked : value };
    if (name === 'country') {
        newData.province = provinces[value][0];
    }
    setFormData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const data = await api.post('/auth/register', { 
          ...registerData, 
          role: activeTab === 'organization' ? 'ORGANIZATION' : 'USER' 
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
      window.location.reload();
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <HandHeart className="h-10 w-10 text-primary" fill="currentColor" />
            <span className="text-3xl font-bold tracking-tight text-primary">Momentris</span>
          </Link>
          <div className="flex bg-gray-100 p-1 rounded-full mb-6">
            <button type="button" className={`flex-1 py-2 rounded-full font-bold ${activeTab === 'individual' ? 'bg-white shadow-sm' : ''}`} onClick={() => setActiveTab('individual')}>Individual</button>
            <button type="button" className={`flex-1 py-2 rounded-full font-bold ${activeTab === 'organization' ? 'bg-white shadow-sm' : ''}`} onClick={() => setActiveTab('organization')}>Organization</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border shadow-xl space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">{activeTab === 'organization' ? 'Organization Name' : 'Full Name'}</label>
            <input name="fullName" required className="w-full rounded-xl border p-3" value={formData.fullName} onChange={handleChange} />
          </div>
          
          {activeTab === 'organization' && (
            <>
              <div>
                <label className="block text-sm font-bold mb-2">Registration Number</label>
                <input name="registrationNumber" required className="w-full rounded-xl border p-3" value={formData.registrationNumber} onChange={handleChange} />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isCharity" checked={formData.isCharity} onChange={handleChange} />
                <span className="text-sm font-bold">Registered Charity?</span>
              </label>
            </>
          )}

          <div>
            <label className="block text-sm font-bold mb-2">Email Address</label>
            <input name="email" required type="email" className="w-full rounded-xl border p-3" value={formData.email} onChange={handleChange} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Country</label>
              <select name="country" required className="w-full rounded-xl border p-3" value={formData.country} onChange={handleChange}>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">{formData.country === 'Canada' ? 'Province' : 'State'}</label>
              <select name="province" required className="w-full rounded-xl border p-3" value={formData.province} onChange={handleChange}>
                {provinces[formData.country].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold mb-2">Password</label>
             <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" required className="w-full rounded-xl border p-3" value={formData.password} onChange={handleChange} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Confirm Password</label>
            <input type="password" name="confirmPassword" required className="w-full rounded-xl border p-3" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          <button type="submit" className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors">
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
