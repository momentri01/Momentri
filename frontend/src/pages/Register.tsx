import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { HandHeart, Mail, Lock, Eye, EyeOff, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const provinces: Record<string, string[]> = {
    'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
    'Canada': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon']
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resending, setResending] = useState(false);
  const [infoNote, setInfoNote] = useState<string | null>(null);
  
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
      await api.post('/auth/register', { 
          ...registerData, 
          role: 'USER' 
      });
      setInfoNote('Welcome to Momentris! We have sent a verification code to your email.');
      setShowMFA(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post('/auth/verify-mfa', {
        email: formData.email,
        code: verificationCode
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-code', { email: formData.email });
      alert('Verification code resent to your email.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/google', {
        idToken: credentialResponse.credential,
        country: formData.country,
        province: formData.province
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  if (showMFA) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-muted/30 px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-6 text-primary">
                <ShieldCheck size={40} />
             </div>
             <h1 className="text-2xl font-black text-gray-900 tracking-tight">Verify your email</h1>
             {infoNote && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3 text-left animate-in fade-in slide-in-from-top-2">
                   <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
                   <p className="text-sm text-blue-700 font-medium leading-relaxed">{infoNote}</p>
                </div>
             )}
             <p className="text-muted-foreground font-medium mt-4">
                We've sent a 6-digit code to <span className="text-gray-900 font-bold">{formData.email}</span>
             </p>
          </div>

          <form onSubmit={handleVerifyMFA} className="bg-white p-8 rounded-[2rem] border shadow-xl space-y-6">
             <div>
                <label className="block text-[10px] font-black mb-2 text-gray-400 uppercase tracking-widest text-center">Enter 6-digit code</label>
                <input 
                  required 
                  maxLength={6}
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 py-4 text-center text-3xl font-black tracking-[0.5em] focus:ring-primary focus:bg-white focus:border-primary transition-all" 
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                />
             </div>

             <button 
                type="submit" 
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-primary text-white py-4 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
             >
                {loading ? 'Verifying...' : 'Complete Registration'}
             </button>

             <div className="text-center">
                <button 
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending}
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline disabled:opacity-50"
                >
                   {resending ? <RefreshCw className="animate-spin h-4 w-4" /> : null}
                   Resend code
                </button>
             </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <HandHeart className="h-10 w-10 text-primary" fill="currentColor" />
            <span className="text-3xl font-bold tracking-tight text-primary">Momentris</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create your account</h1>
            <p className="text-muted-foreground font-medium">Join thousands of people making a difference.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border shadow-xl space-y-6">
          <div className="grid grid-cols-1 gap-4">
             <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert('Google login failed')}
                useOneTap
                theme="outline"
                shape="pill"
                width="100%"
             />
          </div>

          <div className="relative">
             <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
             <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-gray-400">
                <span className="bg-white px-4">Or sign up with email</span>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black mb-1.5 uppercase tracking-widest text-gray-400">Full Name</label>
              <input name="fullName" required className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 focus:ring-primary focus:bg-white transition-all font-medium" placeholder="Jane Doe" value={formData.fullName} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-[10px] font-black mb-1.5 uppercase tracking-widest text-gray-400">Email Address</label>
              <input name="email" required type="email" className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 focus:ring-primary focus:bg-white transition-all font-medium" placeholder="jane@example.com" value={formData.email} onChange={handleChange} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black mb-1.5 uppercase tracking-widest text-gray-400">Country</label>
                <select name="country" required className="w-full rounded-xl border-gray-100 bg-gray-50 p-3 font-medium" value={formData.country} onChange={handleChange}>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black mb-1.5 uppercase tracking-widest text-gray-400">{formData.country === 'Canada' ? 'Province' : 'State'}</label>
                <select name="province" required className="w-full rounded-xl border-gray-100 bg-gray-50 p-3 font-medium" value={formData.province} onChange={handleChange}>
                  {provinces[formData.country].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
               <label className="block text-[10px] font-black mb-1.5 uppercase tracking-widest text-gray-400">Password</label>
               <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" required className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 focus:ring-primary focus:bg-white transition-all font-medium" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
               </div>
            </div>

            <div>
              <label className="block text-[10px] font-black mb-1.5 uppercase tracking-widest text-gray-400">Confirm Password</label>
              <input type="password" name="confirmPassword" required className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 focus:ring-primary focus:bg-white transition-all font-medium" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 mt-4"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
