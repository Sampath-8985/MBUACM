import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { EventStatus } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { createCategory } from '../../services/categories';
import { getEventById, createEvent, updateEvent } from '../../services/events';
import { uploadImage } from '../../services/storage';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { 
  ArrowLeft, 
  Upload, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle2, 
  Save,
  Image as ImageIcon
} from 'lucide-react';

export const AdminEventFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [venue, setVenue] = useState('Mohan Babu University Campus');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [status, setStatus] = useState<EventStatus>('draft');
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [category, setCategory] = useState<string>('hackathon');
  const { categories, reload: reloadCategories } = useCategories();
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const handleAddCategory = async () => {
    setCategoryError(null);
    setAddingCategory(true);
    const res = await createCategory(newCategory);
    setAddingCategory(false);
    if (res.success && res.category) {
      await reloadCategories();
      setCategory(res.category.id);
      setNewCategory('');
    } else {
      setCategoryError(res.error || 'Could not add category.');
    }
  };

  // File upload state
  const [uploadingPoster, setUploadingPoster] = useState(false);

  useEffect(() => {
    const eventId = id;
    if (isEditing && eventId) {
      async function loadExistingEvent() {
        try {
          const ev = await getEventById(eventId as string);
          if (ev) {
            setTitle(ev.title);
            setSummary(ev.summary || '');
            setDescription(ev.description);
            setPosterUrl(ev.poster_url || '');
            // Convert to datetime-local input format (YYYY-MM-DDTHH:mm)
            setStartAt(ev.start_at ? new Date(ev.start_at).toISOString().slice(0, 16) : '');
            setEndAt(ev.end_at ? new Date(ev.end_at).toISOString().slice(0, 16) : '');
            setVenue(ev.venue || '');
            setRegistrationDeadline(ev.registration_deadline ? new Date(ev.registration_deadline).toISOString().slice(0, 16) : '');
            setRegistrationUrl(ev.registration_url || '');
            setEligibility(ev.eligibility_or_instructions || '');
            setStatus(ev.status);
            setRegistrationEnabled(ev.registration_enabled);
            setCategory(ev.category || 'hackathon');
          } else {
            setError('Event not found');
          }
        } catch (err) {
          console.error('Error fetching event for editing:', err);
        } finally {
          setLoading(false);
        }
      }
      loadExistingEvent();
    } else {
      // Defaults for new event: start tomorrow at 10:00 AM, end tomorrow at 17:00 PM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      setStartAt(tomorrow.toISOString().slice(0, 16));

      const tomorrowEnd = new Date(tomorrow);
      tomorrowEnd.setHours(17, 0, 0, 0);
      setEndAt(tomorrowEnd.toISOString().slice(0, 16));
    }
  }, [id, isEditing]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPoster(true);
    setError(null);

    try {
      const res = await uploadImage(file, 'event-posters');
      if (res.error) {
        setError(res.error);
      } else {
        setPosterUrl(res.url);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploadingPoster(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!title.trim()) {
      setError('Event Title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Event Description is required.');
      return;
    }

    if (!startAt || !endAt) {
      setError('Start and End Date/Time are required.');
      return;
    }

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (endDate.getTime() <= startDate.getTime()) {
      setError('Event End Date/Time must be later than Start Date/Time.');
      return;
    }

    if (!registrationUrl.trim()) {
      setError('Google Form link is required so students can register.');
      return;
    }

    setSubmitting(true);

    const eventPayload = {
      title: title.trim(),
      summary: summary.trim() || undefined,
      description: description.trim(),
      poster_url: posterUrl.trim() || undefined,
      start_at: startDate.toISOString(),
      end_at: endDate.toISOString(),
      venue: venue.trim() || 'Mohan Babu University',
      registration_deadline: registrationDeadline ? new Date(registrationDeadline).toISOString() : undefined,
      registration_type: 'external' as const,
      registration_url: registrationUrl.trim(),
      eligibility_or_instructions: eligibility.trim() || undefined,
      status,
      registration_enabled: registrationEnabled,
      category,
    };

    try {
      if (isEditing && id) {
        const res = await updateEvent(id, eventPayload);
        if (res.success) {
          navigate('/admin/events');
        } else {
          setError(res.error || 'Failed to update event.');
        }
      } else {
        const res = await createEvent(eventPayload);
        if (res.success) {
          navigate('/admin/events');
        } else {
          setError(res.error || 'Failed to create event.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Loading event editor..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Event Management</span>
        </Link>

        {/* Title */}
        <div className="glass-panel p-6 sm:p-8 border border-slate-800">
          <div className="pb-6 mb-6 border-b border-slate-800">
            <h2 className="font-display font-bold text-2xl text-white">
              {isEditing ? 'Edit Chapter Event' : 'Create New Chapter Event'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Events published here appear dynamically on the public website without redeploying code.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Summary */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Event Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBU HackSprint 2026: 36-Hour National Hackathon"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Short Summary <span className="text-slate-500 text-[11px]">(Recommended for card previews)</span>
                </label>
                <input
                  type="text"
                  placeholder="One sentence summary of the event highlights"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Provide comprehensive details, tracks, schedule, prerequisites, and prizes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan resize-y"
                />
              </div>
            </div>

            {/* Poster Upload & Image URL */}
            <div className="p-5 rounded-2xl bg-navy-950/60 border border-slate-800 space-y-4">
              <label className="block text-xs font-semibold text-slate-300">
                Event Poster (Upload or Image URL)
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                {/* Poster Preview Box */}
                <div className="h-40 rounded-xl overflow-hidden bg-navy-900 border border-slate-700 flex items-center justify-center relative">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt="Poster Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-3 text-slate-500">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-600" />
                      <span className="text-[11px]">No poster selected</span>
                    </div>
                  )}
                </div>

                {/* Upload or paste input */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="btn-acm-secondary text-xs px-4 py-2 cursor-pointer inline-flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingPoster ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploadingPoster}
                      />
                    </label>
                    <span className="text-xs text-slate-400">or paste direct image URL below:</span>
                  </div>

                  <input
                    type="url"
                    placeholder="https://example.com/poster.jpg"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-acm-cyan"
                  />
                  <p className="text-[11px] text-slate-500">
                    Recommended resolution: 1200x630 (landscape) or standard 16:9 banner.
                  </p>
                </div>
              </div>
            </div>

            {/* Timings & Dates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Start Date & Time <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-acm-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  End Date & Time <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-acm-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Registration Deadline <span className="text-slate-500 text-[11px]">(Optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-acm-cyan"
                />
              </div>
            </div>

            {/* Venue & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Venue or Online Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. MBU Central Computing Lab / Online (Google Meet)"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a new category (e.g. Quiz)"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-acm-cyan"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={addingCategory || !newCategory.trim()}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 disabled:opacity-50"
                  >
                    {addingCategory ? 'Adding...' : 'Add'}
                  </button>
                </div>
                {categoryError && <p className="mt-1 text-[11px] text-rose-400">{categoryError}</p>}
              </div>
            </div>

            {/* Registration: Google Form */}
            <div className="p-5 rounded-2xl bg-navy-950/60 border border-slate-800 space-y-3">
              <label className="block text-xs font-semibold text-purple-300">
                Google Form Link (students register here) <span className="text-rose-400">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://forms.gle/..."
                value={registrationUrl}
                onChange={(e) => setRegistrationUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-purple-500/50 text-white text-xs focus:outline-none focus:border-purple-400"
              />
              <p className="text-[11px] text-slate-400">
                This link is shown as the "Register via Google Form" button on the event page.
              </p>
            </div>

            {/* Eligibility & Instructions */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Eligibility or Instructions <span className="text-slate-500 text-[11px]">(Optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Open to 1st to 4th year B.Tech students. Bring laptop with Docker pre-installed."
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-acm-cyan resize-none"
              />
            </div>

            {/* Publishing Status & Registration Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Publishing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-acm-cyan"
                >
                  <option value="draft">Draft (Private to Admins)</option>
                  <option value="published">Published (Visible Publicly)</option>
                  <option value="completed">Completed (Archived)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={registrationEnabled}
                    onChange={(e) => setRegistrationEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-acm-cyan bg-navy-950 border-slate-700 focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-slate-300">
                    Accepting New Registrations
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
              <Link
                to="/admin/events"
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn-acm-primary px-6 py-2.5 text-sm flex items-center gap-2"
              >
                {submitting ? (
                  <span>Saving Event...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEditing ? 'Save Event Updates' : 'Create & Save Event'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </AdminLayout>
  );
};
