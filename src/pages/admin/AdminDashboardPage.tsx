import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { getEvents } from '../../services/events';
import { getCrew } from '../../services/crew';
import { getAllRegistrations } from '../../services/registrations';
import { getContactSubmissions } from '../../services/contact';
import { getGallery } from '../../services/gallery';
import { ClubEvent, CrewMember, EventRegistration, ContactSubmission, EventGalleryItem } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { 
  Calendar, 
  Users, 
  Ticket, 
  MessageSquare, 
  Sparkles, 
  PlusCircle, 
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Images
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [gallery, setGallery] = useState<EventGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const [evData, crData, regData, cntData, galData] = await Promise.all([
          getEvents(true), // All events including drafts
          getCrew(true),   // All crew
          getAllRegistrations(),
          getContactSubmissions(),
          getGallery(true),
        ]);

        setEvents(evData);
        setCrew(crData);
        setRegistrations(regData);
        setContacts(cntData);
        setGallery(galData);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Calculating chapter database metrics..." />
      </AdminLayout>
    );
  }

  const publishedEvents = events.filter((e) => e.status === 'published');
  const upcomingPublishedEvents = publishedEvents.filter(
    (e) => new Date(e.end_at).getTime() >= Date.now()
  );
  const newContacts = contacts.filter((c) => c.status === 'new');

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Events */}
          <div className="glass-panel p-5 border border-slate-800">
            <div className="flex items-center justify-between text-acm-cyan mb-3">
              <span className="text-xs font-mono font-medium text-slate-400 uppercase">Total Events</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-acm-cyan" />
              </div>
            </div>
            <p className="font-display font-bold text-3xl text-white">{events.length}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-mono">
              <span className="text-acm-cyan font-bold">{upcomingPublishedEvents.length}</span> upcoming / live
            </div>
          </div>

          {/* Active Registrations */}
          <div className="glass-panel p-5 border border-slate-800">
            <div className="flex items-center justify-between text-emerald-400 mb-3">
              <span className="text-xs font-mono font-medium text-slate-400 uppercase">Registrations</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Ticket className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <p className="font-display font-bold text-3xl text-white">{registrations.length}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real database records</span>
            </div>
          </div>

          {/* Crew Members */}
          <div className="glass-panel p-5 border border-slate-800">
            <div className="flex items-center justify-between text-purple-400 mb-3">
              <span className="text-xs font-mono font-medium text-slate-400 uppercase">Crew Members</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="font-display font-bold text-3xl text-white">{crew.length}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-mono">
              <span className="text-purple-300 font-bold">{crew.filter((c) => c.is_published).length}</span> published online
            </div>
          </div>

          {/* Contact Inquiries */}
          <div className="glass-panel p-5 border border-slate-800">
            <div className="flex items-center justify-between text-amber-400 mb-3">
              <span className="text-xs font-mono font-medium text-slate-400 uppercase">Inquiries</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <p className="font-display font-bold text-3xl text-white">{contacts.length}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-mono">
              <span className="text-amber-400 font-bold">{newContacts.length}</span> require review
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="glass-panel p-6 border border-slate-800">
          <h2 className="font-display font-bold text-base text-white mb-4">
            Quick Actions & Management
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <Link
              to="/admin/events/new"
              className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-acm-cyan/50 hover:bg-slate-800/40 transition-all flex items-center justify-between text-xs font-semibold text-slate-200 group"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4 text-acm-cyan" />
                <span>Create New Event</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/crew"
              className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/40 transition-all flex items-center justify-between text-xs font-semibold text-slate-200 group"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Manage Crew Profiles</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/registrations"
              className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/40 transition-all flex items-center justify-between text-xs font-semibold text-slate-200 group"
            >
              <div className="flex items-center gap-2.5">
                <Ticket className="w-4 h-4 text-emerald-400" />
                <span>Export Registrations</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/contacts"
              className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/40 transition-all flex items-center justify-between text-xs font-semibold text-slate-200 group"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Review Inquiries</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/gallery"
              className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-cyan-400/50 hover:bg-slate-800/40 transition-all flex items-center justify-between text-xs font-semibold text-slate-200 group"
            >
              <div className="flex items-center gap-2.5">
                <Images className="w-4 h-4 text-cyan-400" />
                <span>Manage Event Gallery</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>

        {/* Recent Registrations Feed */}
        <div className="glass-panel p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-base text-white">
                Recent Student Registrations
              </h2>
              <p className="text-xs text-slate-400">
                Latest internal registrations submitted by students across events.
              </p>
            </div>
            <Link
              to="/admin/registrations"
              className="text-xs font-semibold text-acm-light hover:underline flex items-center gap-1"
            >
              <span>View All Registrations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {registrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="pb-3 font-semibold">Student Name</th>
                    <th className="pb-3 font-semibold">Roll Number</th>
                    <th className="pb-3 font-semibold">Event</th>
                    <th className="pb-3 font-semibold">Date Registered</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {registrations.slice(0, 5).map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-800/30">
                      <td className="py-3 font-medium text-white">
                        {reg.profile?.full_name || 'Student Member'}
                      </td>
                      <td className="py-3 font-mono text-acm-light">
                        {reg.profile?.roll_number || 'N/A'}
                      </td>
                      <td className="py-3 text-slate-300 max-w-xs truncate">
                        {reg.event?.title || reg.event_id}
                      </td>
                      <td className="py-3 text-slate-400">
                        {new Date(reg.registered_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No registrations recorded in the database yet.
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
