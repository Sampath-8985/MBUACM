import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Shield, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Core Team', path: '/crew' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-blue font-jakarta text-white shadow-[0_8px_24px_-16px_rgba(4,40,90,0.7)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-6">

          {/* Logo & Chapter Brand */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.png"
              alt="MBU ACM Student Chapter Logo"
              className="w-10 h-10 rounded-full object-contain bg-white ring-2 ring-white/80 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-[15px] tracking-tight">ACM Student Chapter</span>
              <span className="text-[11px] text-white/75 font-medium">Mohan Babu University</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 text-[13px] transition-colors ${
                  isActive(link.path)
                    ? 'font-bold text-white'
                    : 'font-medium text-white/80 hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute left-0 -bottom-0.5 h-[3px] w-5 rounded-full bg-brand-orange" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side: contact button + admin shortcuts (admin only after sign-in) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-brand-navy/40 border border-white/25 hover:bg-brand-navy/60 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/90 hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            )}
            <Link
              to="/contact"
              className="px-4 py-2 rounded-lg border border-white/70 text-[13px] font-semibold hover:bg-white hover:text-brand-blue transition-colors"
            >
              Contact us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-brand-deep border-t border-white/15 px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base ${
                isActive(link.path)
                  ? 'bg-white/15 font-bold text-white'
                  : 'font-medium text-white/85 hover:bg-white/10'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isAdmin && (
            <div className="pt-4 mt-2 border-t border-white/15 space-y-1">
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/10 text-white font-semibold text-sm"
              >
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/90 hover:bg-white/10 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
