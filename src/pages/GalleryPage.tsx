import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGallery } from '../services/gallery';
import { EventGalleryItem, EventGalleryPhoto, EventCategory } from '../types';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  Images, 
  Calendar, 
  Users, 
  Sparkles, 
  Search, 
  ChevronRight, 
  X, 
  ChevronLeft, 
  Maximize2, 
  ExternalLink,
  Award,
  Filter,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_LABELS: Record<EventCategory, string> = {
  hackathon: 'Hackathons',
  workshop: 'Workshops',
  talk: 'Tech Talks',
  contest: 'Contests',
  general: 'General Events',
};

const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string; border: string }> = {
  hackathon: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
  workshop: { bg: 'bg-acm-cyan/15', text: 'text-acm-light', border: 'border-acm-cyan/30' },
  talk: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  contest: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  general: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
};

export const GalleryPage: React.FC = () => {
  const [albums, setAlbums] = useState<EventGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Modal / Detailed Album View
  const [activeAlbum, setActiveAlbum] = useState<EventGalleryItem | null>(null);

  // Lightbox View
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadGalleryData() {
      setLoading(true);
      try {
        const data = await getGallery(false); // Only published items
        setAlbums(data);
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGalleryData();
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null || !activeAlbum) return;

      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => 
          prev !== null ? (prev + 1) % activeAlbum.photos.length : 0
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => 
          prev !== null ? (prev - 1 + activeAlbum.photos.length) % activeAlbum.photos.length : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, activeAlbum]);

  // Derive unique years for filter
  const academicYears = Array.from(
    new Set(albums.map((a) => a.academic_year).filter(Boolean))
  ) as string[];

  // Filtered albums
  const filteredAlbums = albums.filter((album) => {
    const matchesSearch =
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (album.highlights && album.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      selectedCategory === 'all' || album.category === selectedCategory;

    const matchesYear =
      selectedYear === 'all' || album.academic_year === selectedYear;

    return matchesSearch && matchesCategory && matchesYear;
  });

  // Totals for metrics
  const totalPhotosCount = albums.reduce((acc, curr) => acc + (curr.photos?.length || 0), 0);
  const totalAttendeesCount = albums.reduce((acc, curr) => acc + (curr.attendees_count || 0), 0);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="py-12 sm:py-20 relative min-h-screen">
      {/* Background Cyber Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] bg-gradient-to-b from-acm-blue/15 via-acm-cyan/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================
            HERO HEADER
        ======================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-acm-cyan/15 text-acm-light border border-acm-cyan/30 text-xs font-mono font-semibold uppercase tracking-wider mb-5">
            <Images className="w-3.5 h-3.5 text-acm-cyan" />
            <span>Chapter Event Gallery</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Moments That Define <span className="text-gradient-acm">Our Journey</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Take an inside look at Mohan Babu University ACM Chapter’s past hackathons, technical workshops, coding clashes, and community symposiums.
          </p>

          {/* Metric Highlights Strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 max-w-xl mx-auto">
            <div className="glass-panel p-3.5 sm:p-4 border border-slate-800 text-center">
              <span className="font-display font-black text-2xl sm:text-3xl text-acm-light block">
                {albums.length}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-mono uppercase tracking-wider mt-1 block">
                Event Albums
              </span>
            </div>
            <div className="glass-panel p-3.5 sm:p-4 border border-slate-800 text-center">
              <span className="font-display font-black text-2xl sm:text-3xl text-cyan-300 block">
                {totalPhotosCount}+
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-mono uppercase tracking-wider mt-1 block">
                Captured Photos
              </span>
            </div>
            <div className="glass-panel p-3.5 sm:p-4 border border-slate-800 text-center">
              <span className="font-display font-black text-2xl sm:text-3xl text-emerald-400 block">
                {totalAttendeesCount}+
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-mono uppercase tracking-wider mt-1 block">
                Attendees Reached
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            CONTROLS: SEARCH & CATEGORY FILTERS
        ======================================================== */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event name, keywords, overview..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900/90 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-acm-cyan transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Academic Year Selector */}
            {academicYears.length > 0 && (
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="text-xs font-mono text-slate-400 uppercase">Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-acm-cyan"
                >
                  <option value="all">All Academic Years</option>
                  {academicYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-acm-blue text-white shadow-glow-sm border border-acm-cyan/40'
                  : 'bg-navy-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              All Events ({albums.length})
            </button>
            {(Object.keys(CATEGORY_LABELS) as EventCategory[]).map((catKey) => {
              const count = albums.filter((a) => a.category === catKey).length;
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-acm-blue text-white shadow-glow-sm border border-acm-cyan/40'
                      : 'bg-navy-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {CATEGORY_LABELS[catKey]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            ALBUM GRID
        ======================================================== */}
        {loading ? (
          <div className="py-24">
            <LoadingSpinner message="Loading chapter event archives & photo galleries..." />
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="glass-panel p-16 text-center border border-slate-800 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Images className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">No Event Albums Found</h3>
            <p className="text-sm text-slate-400 mt-2">
              Try adjusting your search query or selected category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedYear('all');
              }}
              className="btn-acm-secondary text-xs px-4 py-2 mt-5"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlbums.map((album) => {
              const catTheme = CATEGORY_COLORS[album.category] || CATEGORY_COLORS.general;
              const photoCount = album.photos?.length || 0;

              return (
                <div
                  key={album.id}
                  className="glass-panel border border-slate-800/90 rounded-2xl overflow-hidden flex flex-col group hover:border-acm-cyan/40 hover:shadow-glow transition-all duration-300"
                >
                  {/* Album Cover Image */}
                  <div 
                    onClick={() => setActiveAlbum(album)}
                    className="relative h-56 sm:h-64 overflow-hidden cursor-pointer bg-navy-900"
                  >
                    <img
                      src={album.cover_image_url}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-bold ${catTheme.bg} ${catTheme.text} border ${catTheme.border} backdrop-blur-md`}>
                        {CATEGORY_LABELS[album.category] || album.category}
                      </span>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-navy-950/80 text-cyan-300 border border-cyan-400/30 backdrop-blur-md flex items-center gap-1 font-semibold">
                        <Images className="w-3 h-3" />
                        {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                      </span>
                    </div>

                    {/* Bottom Date & Attendees Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 font-mono">
                      <span className="flex items-center gap-1.5 bg-navy-950/80 px-2 py-0.5 rounded-lg border border-slate-700/60">
                        <Calendar className="w-3.5 h-3.5 text-acm-cyan" />
                        {formatDate(album.event_date)}
                      </span>
                      {album.attendees_count && (
                        <span className="flex items-center gap-1.5 bg-navy-950/80 px-2 py-0.5 rounded-lg border border-slate-700/60 text-emerald-300">
                          <Users className="w-3.5 h-3.5" />
                          {album.attendees_count}+ Attendees
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {album.academic_year && (
                        <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block mb-1.5">
                          Academic Year: {album.academic_year}
                        </span>
                      )}

                      <h3 
                        onClick={() => setActiveAlbum(album)}
                        className="font-display font-bold text-lg text-white group-hover:text-acm-cyan transition-colors cursor-pointer line-clamp-2"
                      >
                        {album.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                        {album.summary}
                      </p>

                      {/* Highlights Pill snippet */}
                      {album.highlights && album.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {album.highlights.slice(0, 2).map((h, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                            >
                              ✓ {h}
                            </span>
                          ))}
                          {album.highlights.length > 2 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md text-slate-400">
                              +{album.highlights.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Mini Photo Preview Strips & Button */}
                    <div className="pt-5 mt-5 border-t border-slate-800/80">
                      {photoCount > 0 && (
                        <div className="flex items-center gap-2 mb-3 overflow-hidden">
                          {album.photos.slice(0, 4).map((p, pIdx) => (
                            <div
                              key={p.id || pIdx}
                              onClick={() => {
                                setActiveAlbum(album);
                                setLightboxIndex(pIdx);
                              }}
                              className="w-12 h-10 rounded-lg overflow-hidden border border-slate-700/80 cursor-pointer hover:border-acm-cyan transition-colors shrink-0 bg-navy-900"
                            >
                              <img
                                src={p.url}
                                alt={p.caption || 'Event snapshot'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {photoCount > 4 && (
                            <div 
                              onClick={() => setActiveAlbum(album)}
                              className="w-10 h-10 rounded-lg bg-navy-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-acm-cyan cursor-pointer hover:bg-slate-800 transition-colors shrink-0"
                            >
                              +{photoCount - 4}
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => setActiveAlbum(album)}
                        className="w-full btn-acm-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 group/btn"
                      >
                        <span>View Overview & All Photos</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================
          FULL EVENT ALBUM MODAL
      ======================================================== */}
      {activeAlbum && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/85 backdrop-blur-md p-4 sm:p-6 lg:p-10 flex items-center justify-center">
          <div className="relative w-full max-w-4xl bg-navy-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-slate-800 bg-navy-950/60 sticky top-0 z-10 flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${CATEGORY_COLORS[activeAlbum.category]?.bg} ${CATEGORY_COLORS[activeAlbum.category]?.text} border ${CATEGORY_COLORS[activeAlbum.category]?.border}`}>
                    {CATEGORY_LABELS[activeAlbum.category] || activeAlbum.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {formatDate(activeAlbum.event_date)}
                  </span>
                  {activeAlbum.academic_year && (
                    <span className="text-xs font-mono text-slate-400">
                      • AY {activeAlbum.academic_year}
                    </span>
                  )}
                  {activeAlbum.attendees_count && (
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {activeAlbum.attendees_count}+ Attendees
                    </span>
                  )}
                </div>

                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {activeAlbum.title}
                </h2>
              </div>

              <button
                onClick={() => {
                  setActiveAlbum(null);
                  setLightboxIndex(null);
                }}
                className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
              
              {/* Event Description / Overview */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-acm-cyan mb-2.5">
                  Past Event Overview & Outcomes
                </h4>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line">
                  {activeAlbum.description}
                </p>
              </div>

              {/* Highlights List */}
              {activeAlbum.highlights && activeAlbum.highlights.length > 0 && (
                <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-acm-cyan" /> Event Highlights & Achievements
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeAlbum.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-acm-cyan shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Photos Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-acm-cyan">
                      Event Photo Gallery
                    </h4>
                    <p className="text-xs text-slate-400">
                      Click any photograph to inspect in full resolution
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {activeAlbum.photos.length} photos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {activeAlbum.photos.map((photo, pIdx) => (
                    <div
                      key={photo.id || pIdx}
                      onClick={() => setLightboxIndex(pIdx)}
                      className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-navy-950 cursor-pointer border border-slate-800 hover:border-acm-cyan transition-all shadow-md"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || activeAlbum.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                        <div className="self-end p-1.5 rounded-lg bg-navy-900/80 text-white">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                        {photo.caption && (
                          <p className="text-xs text-white line-clamp-2 font-medium">
                            {photo.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Event Link */}
              {activeAlbum.event_id && (
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <Link
                    to={`/events/${activeAlbum.event_id}`}
                    className="btn-acm-primary text-xs px-4 py-2.5 inline-flex items-center gap-1.5"
                  >
                    <span>View Original Event Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FULL RESOLUTION LIGHTBOX MODAL
      ======================================================== */}
      {lightboxIndex !== null && activeAlbum && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-xl">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-acm-cyan px-2.5 py-1 rounded bg-navy-900 border border-slate-700">
                Photo {lightboxIndex + 1} of {activeAlbum.photos.length}
              </span>
              <span className="text-sm font-semibold text-slate-300 truncate max-w-md hidden sm:inline">
                {activeAlbum.title}
              </span>
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo View Area */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Prev Button */}
            {activeAlbum.photos.length > 1 && (
              <button
                onClick={() =>
                  setLightboxIndex(
                    (prev) =>
                      prev !== null
                        ? (prev - 1 + activeAlbum.photos.length) % activeAlbum.photos.length
                        : 0
                  )
                }
                className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-navy-950/80 hover:bg-navy-900 border border-slate-700 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Photo */}
            <div className="max-w-5xl max-h-full flex items-center justify-center">
              <img
                src={activeAlbum.photos[lightboxIndex]?.url}
                alt={activeAlbum.photos[lightboxIndex]?.caption || activeAlbum.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Next Button */}
            {activeAlbum.photos.length > 1 && (
              <button
                onClick={() =>
                  setLightboxIndex(
                    (prev) =>
                      prev !== null ? (prev + 1) % activeAlbum.photos.length : 0
                  )
                }
                className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-navy-950/80 hover:bg-navy-900 border border-slate-700 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Caption Bar */}
          <div className="max-w-3xl mx-auto w-full text-center py-2">
            {activeAlbum.photos[lightboxIndex]?.caption ? (
              <p className="text-sm sm:text-base text-slate-200 bg-navy-900/80 px-4 py-2 rounded-xl border border-slate-800 inline-block">
                {activeAlbum.photos[lightboxIndex].caption}
              </p>
            ) : (
              <p className="text-xs text-slate-400 font-mono">
                {activeAlbum.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
