import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { EventGalleryItem, EventGalleryPhoto, ClubEvent } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { getGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../services/gallery';
import { getEvents } from '../../services/events';
import { uploadImage } from '../../services/storage';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { 
  Images, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  X, 
  Save, 
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';

export const AdminGalleryPage: React.FC = () => {
  const { categories } = useCategories();
  const CATEGORY_OPTIONS = categories.map((c) => ({ label: c.label, value: c.id }));
  const [albums, setAlbums] = useState<EventGalleryItem[]>([]);
  const [eventsList, setEventsList] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<EventGalleryItem | null>(null);

  // Form Fields
  const [selectedEventId, setSelectedEventId] = useState('');
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [category, setCategory] = useState<string>('hackathon');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [attendeesCount, setAttendeesCount] = useState<number | ''>('');
  const [highlightsText, setHighlightsText] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [photos, setPhotos] = useState<EventGalleryPhoto[]>([]);

  // Manual Photo Input state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Uploading flags
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<EventGalleryItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [galleryData, evData] = await Promise.all([
        getGallery(true), // All albums including unpublished
        getEvents(true),
      ]);
      setAlbums(galleryData);
      setEventsList(evData);
    } catch (err) {
      console.error('Failed to load admin gallery data:', err);
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setEditingAlbum(null);
    setSelectedEventId('');
    setTitle('');
    setEventDate(new Date().toISOString().split('T')[0]);
    setAcademicYear('2024-2025');
    setCategory('hackathon');
    setSummary('');
    setDescription('');
    setCoverImageUrl('');
    setAttendeesCount('');
    setHighlightsText('');
    setIsPublished(true);
    setPhotos([]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (album: EventGalleryItem) => {
    setEditingAlbum(album);
    setSelectedEventId(album.event_id || '');
    setTitle(album.title);
    setEventDate(album.event_date ? album.event_date.split('T')[0] : '');
    setAcademicYear(album.academic_year || '2024-2025');
    setCategory(album.category || 'general');
    setSummary(album.summary || '');
    setDescription(album.description || '');
    setCoverImageUrl(album.cover_image_url || '');
    setAttendeesCount(album.attendees_count ?? '');
    setHighlightsText(album.highlights ? album.highlights.join(', ') : '');
    setIsPublished(album.is_published);
    setPhotos(album.photos || []);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setFormError(null);
    setModalOpen(true);
  };

  // Auto-fill from selected Club Event
  const handleSelectEvent = (evId: string) => {
    setSelectedEventId(evId);
    if (!evId) return;

    const matched = eventsList.find((e) => e.id === evId);
    if (matched) {
      setTitle(matched.title);
      if (matched.start_at) {
        setEventDate(matched.start_at.split('T')[0]);
      }
      if (matched.category) {
        setCategory(matched.category);
      }
      if (matched.summary && !summary) {
        setSummary(matched.summary);
      }
      if (matched.poster_url && !coverImageUrl) {
        setCoverImageUrl(matched.poster_url);
      }
      if (matched.description && !description) {
        setDescription(matched.description);
      }
    }
  };

  // Handle Cover Photo Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setFormError(null);
    try {
      const res = await uploadImage(file, 'gallery-photos');
      if (res.error) {
        setFormError(res.error);
      } else if (res.url) {
        setCoverImageUrl(res.url);
      }
    } catch (err: any) {
      setFormError(err.message || 'Error uploading cover picture.');
    } finally {
      setUploadingCover(false);
    }
  };

  // Handle Batch Event Photos Upload
  const handlePhotosBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    setFormError(null);
    try {
      const newItems: EventGalleryPhoto[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImage(file, 'gallery-photos');
        if (res.url) {
          newItems.push({
            id: `photo-${Date.now()}-${i}`,
            url: res.url,
            caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            uploaded_at: new Date().toISOString(),
          });
        }
      }

      setPhotos((prev) => [...prev, ...newItems]);
      if (!coverImageUrl && newItems.length > 0) {
        setCoverImageUrl(newItems[0].url);
      }
    } catch (err: any) {
      setFormError(err.message || 'Error uploading photos.');
    } finally {
      setUploadingPhotos(false);
      e.target.value = ''; // Reset input
    }
  };

  // Add Single Photo via URL
  const handleAddPhotoViaUrl = () => {
    if (!newPhotoUrl.trim()) return;
    const newP: EventGalleryPhoto = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || undefined,
      uploaded_at: new Date().toISOString(),
    };
    setPhotos((prev) => [...prev, newP]);
    if (!coverImageUrl) {
      setCoverImageUrl(newP.url);
    }
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  // Remove photo
  const handleRemovePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  // Update caption
  const handleUpdateCaption = (photoId: string, newCap: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, caption: newCap } : p))
    );
  };

  // Form Submission
  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please provide an event title.');
      return;
    }
    if (!eventDate) {
      setFormError('Please specify the date this event took place.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please enter a description or past overview for this event.');
      return;
    }

    // Determine cover
    const finalCover =
      coverImageUrl.trim() ||
      (photos.length > 0 ? photos[0].url : 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200');

    // Parse highlights
    const highlights = highlightsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setSaving(true);
    setFormError(null);

    const payload = {
      event_id: selectedEventId || undefined,
      title: title.trim(),
      event_date: eventDate,
      academic_year: academicYear.trim(),
      category,
      summary: summary.trim() || title.trim(),
      description: description.trim(),
      cover_image_url: finalCover,
      photos,
      attendees_count: attendeesCount ? Number(attendeesCount) : undefined,
      highlights,
      is_published: isPublished,
    };

    try {
      if (editingAlbum) {
        const res = await updateGalleryItem(editingAlbum.id, payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to update album.');
          return;
        }
      } else {
        const res = await createGalleryItem(payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to create album.');
          return;
        }
      }

      await loadData();
      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle publish
  const handleTogglePublish = async (album: EventGalleryItem) => {
    try {
      await updateGalleryItem(album.id, { is_published: !album.is_published });
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === album.id ? { ...a, is_published: !a.is_published } : a
        )
      );
    } catch (err) {
      console.error('Error toggling published status:', err);
    }
  };

  // Delete album
  const handleDeleteAlbum = async () => {
    if (!albumToDelete) return;
    try {
      await deleteGalleryItem(albumToDelete.id);
      setAlbums((prev) => prev.filter((a) => a.id !== albumToDelete.id));
      setDeleteModalOpen(false);
      setAlbumToDelete(null);
    } catch (err) {
      console.error('Failed to delete album:', err);
    }
  };

  const totalPhotosCount = albums.reduce((acc, curr) => acc + (curr.photos?.length || 0), 0);
  const totalAttendees = albums.reduce((acc, curr) => acc + (curr.attendees_count || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                Event Gallery & Album Manager
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-acm-cyan/15 text-acm-light border border-acm-cyan/30 uppercase font-semibold">
                {albums.length} Albums
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Upload past event photographs, document overviews, highlight accomplishments, and inspire student developers.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="btn-acm-primary text-xs px-4 py-2.5 flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-glow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Event Album</span>
          </button>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-4 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block mb-1">Total Albums</span>
            <span className="font-display font-black text-2xl text-white block">{albums.length}</span>
            <span className="text-xs text-acm-cyan font-mono mt-1 block">
              {albums.filter((a) => a.is_published).length} Published
            </span>
          </div>

          <div className="glass-panel p-4 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block mb-1">Total Photos</span>
            <span className="font-display font-black text-2xl text-cyan-300 block">{totalPhotosCount}</span>
            <span className="text-xs text-slate-400 font-mono mt-1 block">Uploaded across albums</span>
          </div>

          <div className="glass-panel p-4 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block mb-1">Total Attendees</span>
            <span className="font-display font-black text-2xl text-emerald-400 block">{totalAttendees}+</span>
            <span className="text-xs text-slate-400 font-mono mt-1 block">Recorded engagement</span>
          </div>

          <div className="glass-panel p-4 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block mb-1">Public Gallery</span>
            <a
              href="/gallery"
              target="_blank"
              rel="noreferrer"
              className="font-display font-bold text-sm text-acm-light hover:underline flex items-center gap-1.5 mt-2"
            >
              <span>View Public Page</span>
              <Images className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Albums List */}
        {loading ? (
          <div className="py-16">
            <LoadingSpinner message="Loading event photo albums..." />
          </div>
        ) : albums.length === 0 ? (
          <div className="glass-panel p-12 text-center border border-slate-800">
            <Images className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="font-display font-bold text-base text-white">No Event Albums Created Yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Add your first event album with descriptions and photographs from past hackathons or workshops.
            </p>
            <button
              onClick={openCreateModal}
              className="btn-acm-primary text-xs px-4 py-2 mt-4 inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Event Album</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => {
              const photoCount = album.photos?.length || 0;
              return (
                <div
                  key={album.id}
                  className="glass-panel border border-slate-800/90 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Header */}
                    <div className="relative h-44 bg-navy-900 overflow-hidden">
                      <img
                        src={album.cover_image_url}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                      
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-navy-950/80 text-acm-cyan border border-acm-cyan/30 backdrop-blur-md uppercase font-bold">
                          {album.category}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border backdrop-blur-md ${
                            album.is_published
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {album.is_published ? 'Published' : 'Hidden'}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-slate-300">
                        <span className="bg-navy-950/80 px-2 py-0.5 rounded border border-slate-700/60">
                          {album.event_date ? new Date(album.event_date).toLocaleDateString() : 'No date'}
                        </span>
                        <span className="bg-navy-950/80 px-2 py-0.5 rounded border border-slate-700/60 text-cyan-300">
                          📸 {photoCount} photos
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-display font-bold text-base text-white line-clamp-1">
                        {album.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                        {album.summary || album.description}
                      </p>

                      {album.attendees_count && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono mt-3">
                          <Users className="w-3.5 h-3.5" />
                          <span>{album.attendees_count} Attendees</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => handleTogglePublish(album)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-mono flex items-center gap-1 transition-colors ${
                        album.is_published
                          ? 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                          : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {album.is_published ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Publish
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(album)}
                        className="p-1.5 rounded-lg bg-navy-900 border border-slate-700 text-slate-300 hover:text-white hover:border-acm-cyan transition-colors"
                        title="Edit Album"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setAlbumToDelete(album);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-navy-900 border border-slate-700 text-rose-400 hover:text-rose-300 hover:border-rose-500 transition-colors"
                        title="Delete Album"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================
            ADD / EDIT ALBUM MODAL
        ======================================================== */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/85 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center">
            <div className="relative w-full max-w-3xl bg-navy-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-navy-950/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-acm-cyan">
                    <Images className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      {editingAlbum ? 'Edit Event Album' : 'Create New Event Album'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Configure past event overview, details, and photo gallery
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveAlbum} className="p-6 overflow-y-auto space-y-6 flex-1">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Quick Link to Existing Event */}
                {eventsList.length > 0 && !editingAlbum && (
                  <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 space-y-2">
                    <label className="text-xs font-mono font-semibold text-acm-cyan flex items-center gap-1.5 uppercase">
                      <LinkIcon className="w-3.5 h-3.5" /> Link To Existing Event (Optional)
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => handleSelectEvent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-acm-cyan"
                    >
                      <option value="">-- Choose past/scheduled event to autofill --</option>
                      {eventsList.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title} ({ev.status})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400">
                      Selecting an event auto-fills the title, date, and category.
                    </p>
                  </div>
                )}

                {/* Title & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Event Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. HackSphere 2025: 24-Hour Hackathon"
                      className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-acm-cyan"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Event Date <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-acm-cyan"
                    />
                  </div>
                </div>

                {/* Category & Academic Year & Attendees */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-acm-cyan"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Academic Year</label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      placeholder="e.g. 2024-2025"
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-acm-cyan"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Attendees Count</label>
                    <input
                      type="number"
                      min="0"
                      value={attendeesCount}
                      onChange={(e) => setAttendeesCount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 150"
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-acm-cyan"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Short Summary / Catchphrase</label>
                  <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Brief 1-line overview displayed on cards..."
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-acm-cyan"
                  />
                </div>

                {/* Highlights */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    Key Highlights (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                    placeholder="e.g. 45 Teams, 24 Hours Hacking, ₹50,000 Cash Prize, 5 Mentors"
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-acm-cyan"
                  />
                  <p className="text-[11px] text-slate-400">
                    Separate multiple accomplishments with commas.
                  </p>
                </div>

                {/* Full Description / Overview */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    Past Event Overview & Description <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how the event went, what students built, keynote speakers, prize winners, and overall reception..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-acm-cyan leading-relaxed"
                  />
                </div>

                {/* Cover Image */}
                <div className="space-y-2 p-4 rounded-xl bg-navy-950/70 border border-slate-800">
                  <label className="text-xs font-mono font-semibold text-slate-300 block uppercase">
                    Album Cover Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {coverImageUrl ? (
                      <div className="w-28 h-20 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-navy-900">
                        <img
                          src={coverImageUrl}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-20 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <label className="btn-acm-secondary text-xs px-3 py-1.5 cursor-pointer flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingCover ? 'Uploading...' : 'Upload Cover'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingCover}
                            onChange={handleCoverUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-xs text-slate-400">or enter image URL below</span>
                      </div>
                      <input
                        type="url"
                        value={coverImageUrl}
                        onChange={(e) => setCoverImageUrl(e.target.value)}
                        placeholder="https://example.com/cover.jpg"
                        className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-acm-cyan"
                      />
                    </div>
                  </div>
                </div>

                {/* ========================================================
                    EVENT PHOTOS GALLERY SECTION
                ======================================================== */}
                <div className="space-y-4 p-4 rounded-xl bg-navy-950/70 border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase text-acm-cyan flex items-center gap-1.5">
                        <Images className="w-4 h-4" /> Event Photographs ({photos.length})
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Upload multiple photos taken during the event for other students to explore.
                      </p>
                    </div>

                    {/* Batch Upload Button */}
                    <label className="btn-acm-primary text-xs px-3 py-1.5 cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto shadow-glow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingPhotos ? 'Uploading Photos...' : 'Upload Event Photos'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        disabled={uploadingPhotos}
                        onChange={handlePhotosBatchUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Add via URL */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800/80">
                    <input
                      type="url"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Or add photo image URL..."
                      className="flex-1 w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-acm-cyan"
                    />
                    <input
                      type="text"
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                      placeholder="Optional caption..."
                      className="w-full sm:w-48 px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-acm-cyan"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhotoViaUrl}
                      className="btn-acm-secondary text-xs px-3 py-1.5 w-full sm:w-auto shrink-0"
                    >
                      Add URL Photo
                    </button>
                  </div>

                  {/* Photos Grid in Form */}
                  {photos.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                      No photos added yet. Upload files or enter photo links above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                      {photos.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          className="flex items-start gap-3 p-2.5 rounded-xl bg-navy-900 border border-slate-800 group"
                        >
                          <img
                            src={p.url}
                            alt={p.caption || 'Photo'}
                            className="w-16 h-14 object-cover rounded-lg shrink-0 bg-navy-950"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <input
                              type="text"
                              value={p.caption || ''}
                              onChange={(e) => handleUpdateCaption(p.id, e.target.value)}
                              placeholder="Photo caption..."
                              className="w-full px-2 py-1 rounded bg-navy-950 border border-slate-700/80 text-[11px] text-slate-200 focus:outline-none focus:border-acm-cyan"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setCoverImageUrl(p.url)}
                                className="text-[10px] text-acm-cyan hover:underline"
                              >
                                Set as Cover
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(p.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Remove photo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Published Checkbox */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="album-publish"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-acm-blue bg-navy-950 border-slate-700 focus:ring-0"
                  />
                  <label htmlFor="album-publish" className="text-xs text-slate-300 font-medium">
                    Publish this album to public website immediately
                  </label>
                </div>

                {/* Form Actions Footer */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-navy-900/90 py-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn-acm-secondary text-xs px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploadingCover || uploadingPhotos}
                    className="btn-acm-primary text-xs px-5 py-2 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving Album...' : editingAlbum ? 'Update Album' : 'Create Album'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Event Album?"
          message={`Are you sure you want to permanently delete the album "${albumToDelete?.title}"? This cannot be undone.`}
          confirmLabel="Delete Album"
          isDestructive={true}
          onConfirm={handleDeleteAlbum}
          onCancel={() => {
            setDeleteModalOpen(false);
            setAlbumToDelete(null);
          }}
        />

      </div>
    </AdminLayout>
  );
};
