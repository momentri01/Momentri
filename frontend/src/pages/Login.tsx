import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { HandHeart, Mail, Lock, ArrowRight, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resending, setResending] = useState(false);
  const [infoNote, setInfoNote] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
      window.location.reload();
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.email) {
        setInfoNote('Your account is not verified yet. We have sent a new verification code to your email.');
        // Auto-resend code for convenience
        try {
          await api.post('/auth/resend-code', { email: formData.email });
        } catch (resendError) {
          console.error('Failed to auto-resend code');
        }
        setShowMFA(true);
      } else {
        alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
      }
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
                Enter the 6-digit code sent to <span className="text-gray-900 font-bold">{formData.email}</span>
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
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <HandHeart className="h-10 w-10 text-primary" fill="currentColor" />
            <span className="text-3xl font-bold tracking-tight text-primary">Momentris</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-muted-foreground mt-2">Log in to manage your fundraising events.</p>
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
                <span className="bg-white px-4">Or sign in with email</span>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-xl border-border bg-muted/20 pl-12 pr-4 py-3 focus:ring-primary font-medium"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold">Password</label>
                 <Link to="/forgot-password" className="text-xs text-primary font-bold hover:underline">
                   Forgot password?
                 </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full rounded-xl border-border bg-muted/20 pl-12 pr-4 py-3 focus:ring-primary font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Sign In'}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>

            <p className="text-center text-sm text-muted-foreground pt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
