import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ContactSubmission } from '../../types';
import { getContactSubmissions, updateContactStatus } from '../../services/contact';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  Archive, 
  Clock, 
  X,
  User
} from 'lucide-react';

export const AdminContactSubmissionsPage: React.FC = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    setLoading(true);
    try {
      const data = await getContactSubmissions();
      setContacts(data);
    } catch (err) {
      console.error('Failed to load contact submissions:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'reviewed' | 'archived') => {
    try {
      await updateContactStatus(id, newStatus);
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (e) {
      console.error('Failed to update contact status:', e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h2 className="font-display font-bold text-xl text-white">
            Contact Form Inquiries
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review communications sent by students, faculty, or corporate sponsors through the website.
          </p>
        </div>

        {/* Submissions List */}
        {loading ? (
          <LoadingSpinner message="Loading inquiries..." />
        ) : contacts.length > 0 ? (
          <div className="glass-panel overflow-hidden border border-slate-800">
            <div className="divide-y divide-slate-800/60">
              {contacts.map((msg) => (
                <div
                  key={msg.id}
                  className="p-5 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => setSelectedContact(msg)}>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                        msg.status === 'new'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : msg.status === 'reviewed'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {msg.status.toUpperCase()}
                      </span>
                      <h3 className="font-bold text-white text-sm hover:text-acm-cyan transition-colors">
                        {msg.subject}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <strong className="text-slate-300">{msg.name}</strong>
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <a href={`mailto:${msg.email}`} className="text-acm-cyan hover:underline">
                          {msg.email}
                        </a>
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                    <button
                      onClick={() => setSelectedContact(msg)}
                      className="btn-acm-secondary text-xs px-3 py-1.5"
                    >
                      Read Full
                    </button>
                    {msg.status !== 'reviewed' && (
                      <button
                        onClick={() => handleUpdateStatus(msg.id, 'reviewed')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                        title="Mark as Reviewed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Reviewed</span>
                      </button>
                    )}
                    {msg.status !== 'archived' && (
                      <button
                        onClick={() => handleUpdateStatus(msg.id, 'archived')}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-700 transition-all"
                        title="Archive"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-panel p-16 text-center text-slate-400 border border-slate-800">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No inquiries yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Contact submissions through the public contact page will show here for chapter administrators.
            </p>
          </div>
        )}

        {/* Message Details Modal */}
        {selectedContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl glass-panel p-6 border border-slate-700 shadow-2xl relative text-left space-y-4">
              <button
                onClick={() => setSelectedContact(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-acm-cyan/20 text-acm-light border border-acm-cyan/30 uppercase font-semibold">
                  {selectedContact.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(selectedContact.created_at).toLocaleString()}
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {selectedContact.subject}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  From: <strong className="text-slate-200">{selectedContact.name}</strong> ({selectedContact.email})
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedContact.message}
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                  className="btn-acm-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedContact.id, 'reviewed')}
                    className="px-3 py-2 rounded-xl bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="btn-acm-secondary text-xs px-3 py-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
