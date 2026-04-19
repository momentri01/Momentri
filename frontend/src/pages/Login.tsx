import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { HandHeart, Mail, Lock, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
      window.location.reload(); // Refresh to update Layout state
    } catch (error) {
      alert('Login failed. Please check your credentials.');
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
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-muted-foreground mt-2">Log in to manage your fundraising events.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border shadow-xl space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-xl border-border bg-muted/20 pl-12 pr-4 py-3 focus:ring-primary"
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
                className="w-full rounded-xl border-border bg-muted/20 pl-12 pr-4 py-3 focus:ring-primary"
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
  );
};

export default Login;
