import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ClubEvent, EventRegistration } from '../../types';
import { getEvents } from '../../services/events';
import { getAllRegistrations } from '../../services/registrations';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { 
  Ticket, 
  Search, 
  Download, 
  Filter, 
  User, 
} from 'lucide-react';

export const AdminRegistrationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId') || 'all';

  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedEventId, setSelectedEventId] = useState<string>(initialEventId);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [evData, regData] = await Promise.all([
          getEvents(true),
          getAllRegistrations(),
        ]);
        setEvents(evData);
        setRegistrations(regData);
      } catch (err) {
        console.error('Failed to load registrations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleEventChange = (newId: string) => {
    setSelectedEventId(newId);
    if (newId === 'all') {
      searchParams.delete('eventId');
    } else {
      searchParams.set('eventId', newId);
    }
    setSearchParams(searchParams);
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    // Event match
    if (selectedEventId !== 'all' && reg.event_id !== selectedEventId) {
      return false;
    }

    // Search query match (student name, roll number, email, or event title)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const name = reg.profile?.full_name?.toLowerCase() || '';
      const roll = reg.profile?.roll_number?.toLowerCase() || '';
      const email = reg.profile?.email?.toLowerCase() || '';
      const eventTitle = reg.event?.title?.toLowerCase() || '';

      return name.includes(q) || roll.includes(q) || email.includes(q) || eventTitle.includes(q);
    }

    return true;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) return;

    const headers = ['Registration ID', 'Event Title', 'Student Name', 'Roll Number', 'Branch', 'Academic Year', 'Email', 'Registration Date', 'Status'];
    const rows = filteredRegistrations.map((r) => [
      r.id,
      r.event?.title || r.event_id,
      r.profile?.full_name || 'N/A',
      r.profile?.roll_number || 'N/A',
      r.profile?.branch || 'N/A',
      r.profile?.academic_year || 'N/A',
      r.profile?.email || 'N/A',
      new Date(r.registered_at).toLocaleString(),
      r.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mbu-acm-registrations-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-xl text-white">
              Student Event Registrations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review, filter, and export internal student registration rosters.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={filteredRegistrations.length === 0}
            className="btn-acm-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-acm-cyan" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel p-4 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Event Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-acm-cyan" /> Filter by Event:
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => handleEventChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-acm-cyan"
            >
              <option value="all">All Events ({registrations.length} Total)</option>
              {events.map((ev) => {
                const count = registrations.filter((r) => r.event_id === ev.id).length;
                return (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({count} registered)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Search className="w-3 h-3 text-acm-cyan" /> Search Attendees:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by student name, roll number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-acm-cyan"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        {loading ? (
          <LoadingSpinner message="Querying internal registrations..." />
        ) : filteredRegistrations.length > 0 ? (
          <div className="glass-panel overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-navy-950/70">
                    <th className="py-3.5 px-4 font-semibold">Student Name</th>
                    <th className="py-3.5 px-3 font-semibold">Roll Number</th>
                    <th className="py-3.5 px-3 font-semibold">Event</th>
                    <th className="py-3.5 px-3 font-semibold">Branch & Year</th>
                    <th className="py-3.5 px-3 font-semibold">Email</th>
                    <th className="py-3.5 px-3 font-semibold">Registered At</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-acm-cyan" />
                          <span>{reg.profile?.full_name || 'Student Member'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-acm-light font-bold">
                        {reg.profile?.roll_number || 'N/A'}
                      </td>

                      <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate">
                        {reg.event?.title || reg.event_id}
                      </td>

                      <td className="py-3.5 px-3 text-slate-400 max-w-xs truncate">
                        {[reg.profile?.branch, reg.profile?.academic_year].filter(Boolean).join(' • ') || 'N/A'}
                      </td>

                      <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                        {reg.profile?.email || 'N/A'}
                      </td>

                      <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                        {new Date(reg.registered_at).toLocaleDateString()} {new Date(reg.registered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-navy-950/50 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Showing {filteredRegistrations.length} registrations</span>
              <span className="font-mono text-slate-500">MBU ACM Database Sync</span>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-16 text-center text-slate-400 border border-slate-800">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No registrations match your filter</h3>
            <p className="text-xs text-slate-400 mt-1">
              {searchTerm ? 'Try adjusting your search query.' : 'No students have registered for this event yet.'}
            </p>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
