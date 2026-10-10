import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, RefreshCw, Database } from 'lucide-react';
import { LocalStore } from '../../services/store';

export const DemoBanner: React.FC = () => {
  const { isFirebaseConnected, role, switchDemoRole } = useAuth();

  const handleResetData = () => {
    if (window.confirm('Reset all demo events, crew, gallery, and registrations back to defaults?')) {
      LocalStore.resetToDefault();
      window.location.reload();
    }
  };

  return (
    <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border-b border-slate-800 text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <div className="flex items-center gap-1.5 font-medium">
            <Database className="w-3.5 h-3.5 text-acm-cyan" />
            <span>Mode:</span>
            {isFirebaseConnected ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Firebase Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-acm-accent font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-acm-cyan animate-pulse" />
                Interactive Local / Demo Mode
              </span>
            )}
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Active Persona: <strong className="text-slate-200 capitalize">{role || 'Visitor'}</strong>
          </span>
        </div>

        {/* Persona quick switch buttons */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] hidden sm:inline">Quick Test:</span>
          <button
            onClick={() => switchDemoRole('admin')}
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors ${
              role === 'admin'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Act as Chapter Admin"
          >
            <Shield className="w-3 h-3 text-purple-400" />
            <span>Admin View</span>
          </button>

          <button
            onClick={() => switchDemoRole('student')}
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-colors ${
              role === 'user'
                ? 'bg-acm-cyan/20 text-acm-light border border-acm-cyan/50 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Act as Enrolled Student"
          >
            <User className="w-3 h-3 text-acm-cyan" />
            <span>Student View</span>
          </button>

          {!isFirebaseConnected && (
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 px-2 py-0.5 rounded transition-colors flex items-center gap-1 ml-1"
              title="Reset all demo changes back to seed state"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
