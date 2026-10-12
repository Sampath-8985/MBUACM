import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { getEvents } from '../../services/events';
import { getCrew } from '../../services/crew';
import { getCategories } from '../../services/categories';
import { getContactSubmissions } from '../../services/contact';
import { getGallery } from '../../services/gallery';
import { ClubEvent, CrewMember, ContactSubmission, EventGalleryItem, EventCategoryItem } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { 
  Calendar, 
  Users, 
  Tags, 
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
  const [categories, setCategories] = useState<EventCategoryItem[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [gallery, setGallery] = useState<EventGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const [evData, crData, catData, cntData, galData] = await Promise.all([
          getEvents(true), // All events including drafts
          getCrew(true),   // All crew
          getCategories(),
          getContactSubmissions(),
          getGallery(true),
        ]);

        setEvents(evData);
        setCrew(crData);
        setCategories(catData);
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

          {/* Categories */}
          <div className="glass-panel p-5 border border-slate-800">
            <div className="flex items-center justify-between text-emerald-400 mb-3">
              <span className="text-xs font-mono font-medium text-slate-400 uppercase">Categories</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Tags className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <p className="font-display font-bold text-3xl text-white">{categories.length}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Event categories</span>
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
              to="/admin/categories"
              className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/40 transition-all flex items-center justify-between text-xs font-semibold text-slate-200 group"
            >
              <div className="flex items-center gap-2.5">
                <Tags className="w-4 h-4 text-emerald-400" />
                <span>Manage Categories</span>
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

      </div>
    </AdminLayout>
  );
};
