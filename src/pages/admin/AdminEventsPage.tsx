import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ClubEvent } from '../../types';
import { getEvents, deleteEvent, updateEvent } from '../../services/events';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { 
  Calendar, 
  PlusCircle, 
  Edit, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Eye, 
  EyeOff,
  Filter
} from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const { labelFor } = useCategories();
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<ClubEvent | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const allEvents = await getEvents(true); // Include drafts & all statuses
      setEvents(allEvents);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleTogglePublish = async (event: ClubEvent) => {
    const newStatus = event.status === 'published' ? 'draft' : 'published';
    try {
      await updateEvent(event.id, { status: newStatus });
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.error('Failed to toggle event publish status:', err);
    }
  };

  const handleDeleteClick = (event: ClubEvent) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent(eventToDelete.id);
      setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id));
    } catch (err) {
      console.error('Failed to delete event:', err);
    } finally {
      setDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  const filteredEvents = filterStatus === 'all'
    ? events
    : events.filter((e) => e.status === filterStatus);

  const statusBadge = (status: ClubEvent['status']) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Published</span>;
      case 'draft':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">Draft</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-700/50 text-slate-300 border border-slate-600">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-xl text-white">
              Event Management
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Create, edit, publish, or remove chapter events without modifying code.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter by status */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-navy-900 border border-slate-800 text-xs">
              <span className="text-slate-500 text-[11px] font-mono pl-2 hidden sm:inline">Status:</span>
              {['all', 'published', 'draft', 'completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                    filterStatus === st
                      ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <Link
              to="/admin/events/new"
              className="btn-acm-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>

        {/* Events Table */}
        {loading ? (
          <LoadingSpinner message="Loading events list..." />
        ) : filteredEvents.length > 0 ? (
          <div className="glass-panel overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-navy-950/70">
                    <th className="py-3.5 px-4 font-semibold">Event</th>
                    <th className="py-3.5 px-3 font-semibold">Status</th>
                    <th className="py-3.5 px-3 font-semibold">Category</th>
                    <th className="py-3.5 px-3 font-semibold">Start Date</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEvents.map((event) => {
                    const startDate = new Date(event.start_at);
                    return (
                      <tr key={event.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-navy-950 shrink-0 border border-slate-800">
                              <img
                                src={event.poster_url || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=200'}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-white text-xs line-clamp-1">{event.title}</p>
                              <span className="text-[11px] text-slate-400 line-clamp-1">
                                {event.venue || 'Mohan Babu University'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {statusBadge(event.status)}
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="text-[11px] font-mono text-slate-300">
                            {labelFor(event.category)}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap text-slate-400">
                          {startDate.toLocaleDateString()} {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            {/* Toggle Publish */}
                            <button
                              onClick={() => handleTogglePublish(event)}
                              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                event.status === 'published'
                                  ? 'bg-slate-800 text-slate-300 hover:text-amber-400 border-slate-700'
                                  : 'bg-emerald-950/60 text-emerald-300 hover:text-emerald-200 border-emerald-500/40'
                              }`}
                              title={event.status === 'published' ? 'Unpublish Event (Hide from Public)' : 'Publish Event Online'}
                            >
                              {event.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>

                            {/* Edit */}
                            <Link
                              to={`/admin/events/edit/${event.id}`}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                              title="Edit Event Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteClick(event)}
                              className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-16 text-center text-slate-400 border border-slate-800">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No events found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;Create Event&quot; to draft or publish your first event.
            </p>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Event?"
          message={`Are you sure you want to delete "${eventToDelete?.title}"? This will permanently remove the event.`}
          confirmLabel="Yes, Delete Permanently"
          cancelLabel="Cancel"
          isDestructive={true}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />

      </div>
    </AdminLayout>
  );
};
