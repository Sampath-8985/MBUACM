import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EventRegistration } from '../../types';
import { getUserRegistrations, cancelRegistration } from '../../services/registrations';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { 
  User, 
  Calendar, 
  Ticket, 
  LogOut, 
  Edit3, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ExternalLink,
  Sparkles,
  QrCode,
  X
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { user, profile, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedRegId, setSelectedRegId] = useState<string | null>(null);
  const [passModalReg, setPassModalReg] = useState<EventRegistration | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/dashboard');
      return;
    }

    async function loadUserRegistrations() {
      if (!user) return;
      setLoading(true);
      try {
        const regs = await getUserRegistrations(user.id);
        setRegistrations(regs);
      } catch (err) {
        console.error('Failed to load user registrations:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserRegistrations();
  }, [user, isAuthenticated, navigate]);

  const handleCancelClick = (regId: string) => {
    setSelectedRegId(regId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRegId) return;
    try {
      await cancelRegistration(selectedRegId);
      setRegistrations((prev) => prev.filter((r) => r.id !== selectedRegId));
    } catch (err) {
      console.error('Failed to cancel registration:', err);
    } finally {
      setCancelModalOpen(false);
      setSelectedRegId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Loading your dashboard & registrations..." />
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header Banner */}
        <div className="glass-panel p-6 sm:p-8 border border-slate-800 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-acm-blue/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-acm-blue to-cyan-400 p-0.5 shadow-glow-sm">
                <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center font-display font-extrabold text-2xl text-acm-light">
                  {profile?.full_name?.charAt(0).toUpperCase() || 'S'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
                    Welcome, {profile?.full_name || 'Student'}
                  </h1>
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-acm-cyan/15 text-acm-light border border-acm-cyan/40">
                    Student Member
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Roll No: <span className="text-slate-200 font-semibold">{profile?.roll_number || 'Pending'}</span> • {profile?.branch || 'Department not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="btn-acm-secondary text-xs px-4 py-2 flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
              <button
                onClick={() => logout().then(() => navigate('/'))}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 border border-rose-500/20 transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Registered Events Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2.5">
                <Ticket className="w-6 h-6 text-acm-cyan" />
                <span>My Registered Events</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-navy-900 text-acm-light border border-slate-700">
                  {registrations.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your internal registrations, venue passes, and event schedule.
              </p>
            </div>

            <Link
              to="/events"
              className="btn-acm-primary text-xs px-4 py-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Browse All Events</span>
            </Link>
          </div>

          {registrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map((reg) => {
                const event = reg.event;
                if (!event) return null;

                const startDate = new Date(event.start_at);
                const regDate = new Date(reg.registered_at);

                return (
                  <div
                    key={reg.id}
                    className="glass-card-interactive rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Event Poster Header */}
                      <div className="relative h-36 w-full bg-navy-950 overflow-hidden">
                        <img
                          src={event.poster_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-black/40" />

                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-navy-950">
                            Confirmed Registration
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[11px] text-white flex items-center gap-1.5 font-medium bg-navy-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-800">
                          <Calendar className="w-3 h-3 text-acm-cyan" />
                          <span>{startDate.toLocaleDateString()} • {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <h3 className="font-display font-bold text-base text-white line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          Venue: {event.venue || 'Mohan Babu University'}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Registered on {regDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-5 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setPassModalReg(reg)}
                        className="btn-acm-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5 text-acm-cyan" />
                        <span>View Pass</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/events/${event.id}`}
                          className="text-xs text-acm-light hover:underline font-medium"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleCancelClick(reg.id)}
                          className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-16 text-center text-slate-400 border border-slate-800">
              <Ticket className="w-14 h-14 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">No internal registrations yet</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                You have not registered for any events through the chapter website. Check out our upcoming hackathons and workshops!
              </p>
              <Link
                to="/events"
                className="mt-6 btn-acm-primary inline-flex items-center gap-2 text-xs px-5 py-2.5"
              >
                <span>Discover Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Confirmation Modal for Cancelling Registration */}
        <ConfirmModal
          isOpen={cancelModalOpen}
          title="Cancel Event Registration?"
          message="Are you sure you want to cancel your registration for this event? Your seat will be released for other students."
          confirmLabel="Yes, Cancel Registration"
          cancelLabel="Keep My Registration"
          isDestructive={true}
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancelModalOpen(false)}
        />

        {/* Digital Event Pass Modal */}
        {passModalReg && passModalReg.event && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-acm-cyan/40 shadow-glow relative text-left">
              <button
                onClick={() => setPassModalReg(null)}
                className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close pass"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-acm-cyan/20 text-acm-light border border-acm-cyan/40 font-semibold uppercase">
                  MBU ACM Digital Pass
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {passModalReg.id.substring(0, 10)}</span>
              </div>

              <h3 className="font-display font-extrabold text-xl text-white mb-1">
                {passModalReg.event.title}
              </h3>
              <p className="text-xs text-acm-cyan mb-4">
                {passModalReg.event.venue || 'Mohan Babu University Campus'}
              </p>

              {/* Pass Details Box */}
              <div className="bg-navy-950/80 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs text-slate-300 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Attendee:</span>
                  <span className="text-white font-semibold">{profile?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Roll No:</span>
                  <span className="text-acm-light font-bold">{profile?.roll_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Branch:</span>
                  <span className="text-white">{profile?.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-400 font-semibold">VERIFIED ATTENDEE</span>
                </div>
              </div>

              {/* Simulated QR Visual */}
              <div className="my-5 p-4 rounded-2xl bg-white flex flex-col items-center justify-center text-navy-950 text-center">
                <QrCode className="w-28 h-28 text-navy-950" />
                <span className="text-[10px] font-mono text-slate-600 mt-1 uppercase font-semibold">
                  Scan at registration desk on event day
                </span>
              </div>

              <button
                onClick={() => setPassModalReg(null)}
                className="btn-acm-secondary w-full text-xs py-2.5"
              >
                Close Pass
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
