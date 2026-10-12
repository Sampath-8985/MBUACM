import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Camera, MapPin } from 'lucide-react';
import { getEvents } from '../services/events';
import { getGallery } from '../services/gallery';
import { teams } from '../lib/teams';
import { ClubEvent, EventGalleryItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// ---------------------------------------------------------------------------
// Small helpers (display only)
// ---------------------------------------------------------------------------
const fmtDay = (d: Date, withYear: boolean) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) });

function formatDateRange(startIso: string, endIso: string): string {
  const s = new Date(startIso);
  const e = new Date(endIso);
  if (isNaN(s.getTime())) return '';
  if (isNaN(e.getTime()) || s.toDateString() === e.toDateString()) return fmtDay(s, true);
  if (s.getFullYear() === e.getFullYear()) return `${fmtDay(s, false)} to ${fmtDay(e, true)}`;
  return `${fmtDay(s, true)} to ${fmtDay(e, true)}`;
}

// Colourful placeholder tiles (used when no poster / gallery photo exists yet)
const tileStyles = [
  'from-[#1e9be0] to-[#0a6fbd]',
  'from-[#ffa05a] to-[#ee6a1c]',
  'from-[#0a86d2] to-[#07579e]',
  'from-[#6cc8e6] to-[#2a97d6]',
  'from-[#fcd04a] to-[#e48f0c]',
];

const PlaceholderArt: React.FC<{ index?: number; className?: string; iconClass?: string }> = ({
  index = 0,
  className = '',
  iconClass = 'w-5 h-5',
}) => (
  <div className={`relative overflow-hidden bg-gradient-to-br ${tileStyles[index % tileStyles.length]} ${className}`}>
    <span className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/15" />
    <span className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10" />
    <Camera className={`absolute inset-0 m-auto text-white/80 ${iconClass}`} />
  </div>
);

// ---------------------------------------------------------------------------
// Event card used on the home page
// ---------------------------------------------------------------------------
const HomeEventCard: React.FC<{ event: ClubEvent; index: number }> = ({ event, index }) => {
  const { labelFor } = useCategories();
  const [posterFailed, setPosterFailed] = useState(false);
  const isPast = event.status === 'completed' || new Date(event.end_at).getTime() < Date.now();

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex min-h-[11.5rem] overflow-hidden rounded-2xl bg-brand-navy text-white shadow-[0_18px_40px_-22px_rgba(7,23,46,0.8)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(7,23,46,0.9)]"
    >
      {/* Poster */}
      <div className="relative w-[38%] shrink-0">
        {event.poster_url && !posterFailed ? (
          <img
            src={event.poster_url}
            alt={event.title}
            loading="lazy"
            onError={() => setPosterFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderArt index={index} className="absolute inset-0" iconClass="w-6 h-6" />
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 min-w-0">
        <span
          className={`self-start rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide ${
            isPast ? 'bg-white/10 text-white/70' : 'bg-brand-orange/20 text-[#ffb27d]'
          }`}
        >
          {labelFor(event.category)} · {isPast ? 'Past' : 'Upcoming'}
        </span>

        <h3 className="mt-3 text-lg sm:text-xl font-extrabold leading-snug tracking-tight line-clamp-3">
          {event.title}
        </h3>

        <div className="mt-3 space-y-1.5 text-[11px] text-white/70">
          <p className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDateRange(event.start_at, event.end_at)}</span>
          </p>
          <p className="flex items-center gap-2 min-w-0">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{event.venue || 'Mohan Babu University'}</span>
          </p>
        </div>

        <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange">
          View details
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export const HomePage: React.FC = () => {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [albums, setAlbums] = useState<EventGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedEvents, loadedAlbums] = await Promise.all([getEvents(false), getGallery(false)]);
        setEvents(loadedEvents);
        setAlbums(loadedAlbums);
      } catch (e) {
        console.error('Error loading home data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Photos for the scrolling strip: only what the admin added in Event Gallery
  const galleryPhotos: { url: string; alt: string }[] = [];
  const seenUrls = new Set<string>();
  [...albums]
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
    .forEach((album) => {
      [album.cover_image_url, ...(album.photos || []).map((p) => p.url)].forEach((url) => {
        if (url && !seenUrls.has(url) && galleryPhotos.length < 40) {
          seenUrls.add(url);
          galleryPhotos.push({ url, alt: album.title });
        }
      });
    });
  // Repeat short lists so the strip always fills the screen
  const stripPhotos = galleryPhotos.length
    ? Array.from({ length: Math.max(1, Math.ceil(8 / galleryPhotos.length)) }, () => galleryPhotos).flat()
    : [];
  const stripSeconds = Math.max(30, stripPhotos.length * 5);

  const upcomingEvents = events
    .filter((e) => e.status === 'published' && new Date(e.end_at).getTime() >= Date.now())
    .slice(0, 3);

  // Most recent finished events (newest first)
  const pastEvents = events
    .filter((e) => e.status === 'completed' || new Date(e.end_at).getTime() < Date.now())
    .sort((a, b) => new Date(b.end_at).getTime() - new Date(a.end_at).getTime())
    .slice(0, 4);

  // Hero poster: the newest event that has a poster
  const latestEvent =
    [...events]
      .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
      .find((e) => e.poster_url) || null;

  return (
    <div className="bg-white font-jakarta text-brand-navy overflow-hidden">
      {/* ========================================================
          HERO
      ======================================================== */}
      <section
        className="relative text-white"
        style={{
          background: 'linear-gradient(180deg, #0a86d2 0%, #0870c0 45%, #064a95 100%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)',
        }}
      >
        {/* decorative dots + rings */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.28) 1.2px, transparent 1.2px)',
            backgroundSize: '22px 22px',
            WebkitMaskImage: 'radial-gradient(circle at 75% 40%, black 0%, transparent 65%)',
            maskImage: 'radial-gradient(circle at 75% 40%, black 0%, transparent 65%)',
          }}
        />
        <span className="pointer-events-none absolute -right-24 -top-24 h-[34rem] w-[34rem] rounded-full border border-white/10" />
        <span className="pointer-events-none absolute right-10 top-4 h-[26rem] w-[26rem] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-14 pb-28 sm:pt-16 sm:pb-32 lg:pb-40 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Text */}
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-[-0.04em]">
              Code together.
              <br />
              <span className="text-brand-orange">Grow together.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] sm:text-base leading-relaxed text-white/85">
              Workshops, hackathons and coding contests for engineering students at Mohan Babu University, run by
              students like you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_-10px_rgba(249,123,44,0.9)] transition-all hover:-translate-y-0.5 hover:brightness-110"
              >
                See events <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center rounded-xl border border-white/70 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-brand-blue"
              >
                About the chapter
              </Link>
            </div>
          </div>

          {/* Latest event poster */}
          <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[21rem] lg:ml-auto lg:mr-6">
            <Link
              to={events.length ? `/events/${events[0].id}` : '/events'}
              className="block rotate-[5deg] rounded-2xl bg-white p-1.5 shadow-[0_30px_60px_-20px_rgba(2,24,58,0.8)] transition-transform duration-300 hover:rotate-[3deg] hover:scale-[1.02]"
              aria-label={latestEvent ? `Latest event: ${latestEvent.title}` : 'See events'}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-brand-navy">
                {latestEvent?.poster_url ? (
                  <img
                    src={latestEvent.poster_url}
                    alt={latestEvent.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1e9be0] to-[#064a95]">
                    <img src="/logo.png" alt="" className="h-28 w-28 rounded-full bg-white object-contain p-1" />
                  </div>
                )}
              </div>
            </Link>

            {latestEvent && (
              <div className="absolute -top-3 right-0 sm:-right-6 max-w-[11.5rem] rotate-[5deg] rounded-xl bg-white px-3 py-2 text-brand-navy shadow-xl">
                <p className="text-[9px] font-medium text-slate-400">Latest event</p>
                <p className="text-[12px] font-extrabold leading-tight line-clamp-2">{latestEvent.title}</p>
              </div>
            )}

            <div className="absolute -bottom-5 -left-5 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_14px_30px_-10px_rgba(249,123,44,0.9)]">
              <span className="text-2xl font-extrabold leading-none">{events.length}</span>
              <span className="mt-0.5 text-[10px] font-semibold">teams</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          EVENTS
      ======================================================== */}
      <section className="pt-16 pb-20 sm:pt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold text-brand-blue">What’s on</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-[-0.03em]">
                Events at <span className="text-brand-blue">MBU ACM</span>
              </h2>
              <p className="mt-3 text-[13px] text-slate-500">Register for each event on its own page.</p>
            </div>
            <Link
              to="/events"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-navy transition-colors"
            >
              All events <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading chapter events..." />
          ) : (
            <div className="space-y-5">
              {(pastEvents.length > 0 || upcomingEvents.length > 0) && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {pastEvents.map((event, i) => (
                    <HomeEventCard key={event.id} event={event} index={i} />
                  ))}
                  {upcomingEvents.map((event, i) => (
                    <HomeEventCard key={event.id} event={event} index={pastEvents.length + i} />
                  ))}
                </div>
              )}

              {upcomingEvents.length === 0 && (
                <div className="flex items-center gap-4 rounded-2xl border-l-4 border-brand-orange bg-brand-mist px-5 py-5 sm:px-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-orange shadow-sm">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold">Next event: coming soon</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Nothing is scheduled right now. New events are posted here as soon as they are confirmed.
                    </p>
                  </div>
                </div>
              )}

              <Link
                to="/events"
                className="sm:hidden inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue"
              >
                All events <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          TEAMS
      ======================================================== */}
      <section className="bg-brand-mist py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-bold text-brand-blue">Our teams</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-[-0.03em]">
                Six teams. <span className="text-brand-blue">One chapter.</span>
              </h2>
            </div>
            <p className="max-w-xs text-[13px] leading-relaxed text-slate-500">
              Behind every event is a team of students. Find the one that fits what you enjoy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team, i) => {
              const Icon = team.icon;
              return (
                <Link
                  key={team.name}
                  to="/about"
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_8px_24px_-18px_rgba(10,35,66,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-18px_rgba(10,134,210,0.5)]"
                >
                  <span className="absolute right-4 top-2 text-5xl font-extrabold tracking-tight text-slate-100 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="relative mt-5 text-[15px] font-extrabold leading-tight">{team.name}</h3>
                  <p className="relative mt-1 text-[11px] font-semibold text-brand-blue">{team.tagline}</p>
                  <p className="relative mt-3 text-xs leading-relaxed text-slate-500">{team.summary}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          GALLERY STRIP
      ======================================================== */}
      <section className="bg-brand-navy pt-16 sm:pt-20 pb-14 text-white">
        <style>{`
          @keyframes acm-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .acm-marquee-track { animation: acm-marquee var(--acm-dur, 40s) linear infinite; }
          .acm-marquee:hover .acm-marquee-track { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) {
            .acm-marquee { overflow-x: auto; }
            .acm-marquee-track { animation: none; }
          }
        `}</style>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold text-brand-orange">Gallery</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-[-0.03em]">
                Life at <span className="text-brand-orange">ACM</span>
              </h2>
              <p className="mt-3 text-[13px] text-white/60">Photos from our events, workshops and activities.</p>
            </div>
            <Link
              to="/gallery"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white transition-colors"
            >
              View all photos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {stripPhotos.length > 0 ? (
          /* Auto-scrolling photo strip (pauses on hover) */
          <div className="acm-marquee">
            <div
              className="acm-marquee-track flex w-max items-start"
              style={{ '--acm-dur': `${stripSeconds}s` } as React.CSSProperties}
            >
              {[...stripPhotos, ...stripPhotos].map((photo, i) => (
                <Link
                  key={i}
                  to="/gallery"
                  className={`shrink-0 pr-5 ${i % 2 ? 'mt-6' : ''}`}
                  aria-hidden={i >= stripPhotos.length}
                  tabIndex={i >= stripPhotos.length ? -1 : 0}
                >
                  <img
                    src={photo.url}
                    alt={i >= stripPhotos.length ? '' : photo.alt}
                    loading="lazy"
                    className="h-64 w-48 sm:h-72 sm:w-56 rounded-2xl object-cover"
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* No photos added yet: show placeholder tiles */
          <div className="flex justify-center overflow-hidden">
            <div className="flex shrink-0 items-start gap-5">
              {Array.from({ length: 9 }, (_, i) => (
                <PlaceholderArt
                  key={i}
                  index={i}
                  iconClass="w-5 h-5"
                  className={`h-64 w-48 sm:h-72 sm:w-56 shrink-0 rounded-2xl ${i % 2 ? 'mt-6' : ''}`}
                />
              ))}
            </div>
          </div>
        )}

        <Link
          to="/gallery"
          className="sm:hidden mx-4 mt-8 inline-flex items-center gap-1.5 text-xs font-bold text-white/80"
        >
          View all photos <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      {/* ========================================================
          JOIN BANNER (sits across the gallery / footer edge)
      ======================================================== */}
      <section
        className="px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(to bottom, #0a2342 50%, #07172e 50%)' }}
      >
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a86d2] to-[#0a72be] px-6 py-9 sm:px-12 shadow-[0_24px_60px_-24px_rgba(10,134,210,0.9)]">
          <span className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-white">Want to join a team?</h2>
              <p className="mt-2 text-[13px] text-white/85">
                Write to us and tell us which team you are interested in.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-blue shadow-lg transition-all hover:-translate-y-0.5 md:self-auto"
            >
              Contact the chapter <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
