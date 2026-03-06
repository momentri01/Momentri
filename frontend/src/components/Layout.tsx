import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, User, LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-primary" fill="currentColor" />
                <span className="text-2xl font-bold tracking-tight text-primary">Momentri</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/home" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Browse Events
              </Link>
              {user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="text-sm font-black text-primary flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full border border-primary/20 hover:bg-primary/10 transition-all">
                      <ShieldAlert size={18} />
                      Admin
                    </Link>
                  )}
                  <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/home" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted">
                Browse Events
              </Link>
              {user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-bold text-primary hover:bg-primary/5">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted">
                    Login
                  </Link>
                  <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-primary hover:bg-muted">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-muted py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-primary" fill="currentColor" />
                <span className="text-xl font-bold tracking-tight text-primary">Momentri</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                Empowering communities to raise funds for what matters most. Clean, simple, and transparent.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/home" className="hover:text-primary">Browse Events</Link></li>
                <li><Link to="/create-event" className="hover:text-primary">Create Event</Link></li>
                <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Momentri. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
