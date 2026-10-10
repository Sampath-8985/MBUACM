import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  X, 
  Shield, 
  User, 
  LogOut, 
  Calendar, 
  ChevronDown, 
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, profile, role, isAdmin, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Crew', path: '/crew' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Chapter Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-acm-blue via-cyan-400 to-acm-light shadow-glow-sm group-hover:shadow-glow group-hover:scale-105 transition-all shrink-0">
              <img
                src="/logo.png"
                alt="MBU ACM Student Chapter Logo"
                className="w-full h-full object-contain rounded-full bg-navy-950 p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-acm-cyan transition-colors">
                  MBU ACM
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-acm-cyan/15 text-acm-light border border-acm-cyan/30 uppercase tracking-wider font-semibold">
                  Chapter
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Mohan Babu University</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-white bg-slate-800/80 shadow-sm border border-slate-700/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth & Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-700/80 hover:border-acm-cyan/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-acm-blue/30 to-purple-500/30 border border-acm-cyan/30 flex items-center justify-center text-xs font-bold text-acm-light">
                    {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                      {profile?.full_name || 'My Account'}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                      {isAdmin ? (
                        <span className="text-purple-400 font-bold flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" /> Admin
                        </span>
                      ) : (
                        <span>Student</span>
                      )}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 border border-slate-700/90"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-semibold text-slate-100 truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 hover:bg-purple-950/40 hover:text-purple-200 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800/70 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-acm-cyan" />
                      <span>User Dashboard</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800/70 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-acm-primary text-sm py-2 px-4.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join ACM</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-base font-medium ${
                isActive(link.path)
                  ? 'text-white bg-slate-800 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-1 text-xs text-slate-400 font-mono">
                  Signed in as <strong className="text-slate-200">{profile?.full_name || user?.email}</strong>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-purple-900/30 text-purple-300 font-semibold text-sm"
                  >
                    <Shield className="w-4 h-4" /> Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 text-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-acm-cyan" /> User Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 text-sm"
                >
                  <User className="w-4 h-4" /> Profile Details
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-950/30 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-navy-800 text-slate-200 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="btn-acm-primary text-center text-sm"
                >
                  Join ACM
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
