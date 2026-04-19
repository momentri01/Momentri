import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { HandHeart, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, this would call /auth/forgot-password
      // For now, we simulate success
      // await api.post('/auth/forgot-password', { email });
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 1000);
    } catch (error) {
      alert('Something went wrong. Please try again.');
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
          <h2 className="text-3xl font-bold text-gray-900">Reset your password</h2>
          <p className="text-muted-foreground mt-2">
            {submitted 
              ? "Check your email for instructions." 
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border shadow-xl space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="email"
                  required
                  className="w-full rounded-xl border-border bg-muted/20 pl-12 pr-4 py-3 focus:ring-primary"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>

            <p className="text-center text-sm text-muted-foreground pt-4">
              Remember your password?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <div className="bg-white p-12 rounded-[2rem] border shadow-xl text-center space-y-6">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold">Email Sent!</h3>
            <p className="text-muted-foreground">
              We've sent a password reset link to <span className="font-bold text-gray-900">{email}</span>.
            </p>
            <Link 
              to="/login" 
              className="w-full inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
