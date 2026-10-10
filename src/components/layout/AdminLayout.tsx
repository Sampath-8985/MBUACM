import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Ticket, 
  MessageSquare, 
  Images,
  Shield, 
  ArrowLeft,
  PlusCircle, 
  ExternalLink
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="py-24 text-center text-slate-400">Verifying administrative credentials...</div>;
  }

  // Strict role-protection
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Events', path: '/admin/events', icon: Calendar },
    { name: 'Event Gallery', path: '/admin/gallery', icon: Images },
    { name: 'Crew Management', path: '/admin/crew', icon: Users },
    { name: 'Event Registrations', path: '/admin/registrations', icon: Ticket },
    { name: 'Contact Submissions', path: '/admin/contacts', icon: MessageSquare },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-glow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-xl sm:text-2xl text-white">
                  Admin Command Center
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold uppercase">
                  Privileged Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mohan Babu University ACM Chapter Control Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/events/new"
              className="btn-acm-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create New Event</span>
            </Link>
            <Link
              to="/"
              className="btn-acm-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </Link>
          </div>
        </div>

        {/* Admin Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 border-b border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-purple-950/60 text-purple-200 border border-purple-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Content Body */}
        {children}

      </div>
    </div>
  );
};
