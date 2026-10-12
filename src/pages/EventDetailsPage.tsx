import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClubEvent } from '../types';
import { getEventById } from '../services/events';
import { useCategories } from '../hooks/useCategories';
import { categoryTheme } from '../lib/categoryTheme';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  Share2,
  Users,
  ShieldCheck
} from 'lucide-react';

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { labelFor } = useCategories();

  const [event, setEvent] = useState<ClubEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function fetchEventDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const ev = await getEventById(id);
        setEvent(ev);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Loading event details..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center">
        <div className="glass-panel p-8 border border-slate-800">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Event Not Found</h2>
          <p className="text-sm text-slate-400 mt-2">The event you are looking for does not exist or has been removed.</p>
          <Link to="/events" className="mt-6 btn-acm-primary inline-flex items-center gap-2 text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to All Events
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.start_at);
  const endDate = new Date(event.end_at);
  const now = Date.now();
  const isPast = endDate.getTime() < now || event.status === 'completed';
  const isDeadlinePassed = event.registration_deadline
    ? new Date(event.registration_deadline).getTime() > now
    : false;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const defaultPoster = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Events</span>
        </Link>

        {/* Poster Visual Header */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl mb-10">
          <div className="h-64 sm:h-96 w-full relative bg-navy-950">
            <img
              src={event.poster_url || defaultPoster}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultPoster;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />

            {/* Badges on top of poster */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full backdrop-blur-md border uppercase ${categoryTheme(event.category).bg} ${categoryTheme(event.category).text} ${categoryTheme(event.category).border}`}>
                {labelFor(event.category)}
              </span>
              <span className="text-xs font-mono font-medium px-3 py-1 rounded-full backdrop-blur-md border bg-purple-950/80 text-purple-300 border-purple-500/40">
                Google Form Registration
              </span>
            </div>

            {/* Quick Share button */}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2 rounded-xl bg-navy-900/80 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-all flex items-center gap-1.5 text-xs"
              title="Copy event link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* Title and Headline inside banner */}
          <div className="p-6 sm:p-8 -mt-16 sm:-mt-24 relative z-10">
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              {event.title}
            </h1>
            {event.summary && (
              <p className="mt-3 text-base sm:text-lg text-slate-300 font-medium">
                {event.summary}
              </p>
            )}
          </div>
        </div>

        {/* Content & Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Description (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-6 sm:p-8 border border-slate-800">
              <h2 className="font-display font-bold text-xl text-white mb-4">
                About This Event
              </h2>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
                {event.description}
              </div>

              {event.eligibility_or_instructions && (
                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  <h3 className="font-display font-semibold text-sm text-acm-cyan flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4" /> Eligibility & Instructions
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed bg-navy-950/60 p-4 rounded-xl border border-slate-800/80">
                    {event.eligibility_or_instructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Registration Sidebar (Right 1 col) */}
          <div className="space-y-6">
            <div className="glass-panel p-6 border border-slate-800 space-y-6 sticky top-28">
              
              <h3 className="font-display font-bold text-lg text-white pb-3 border-b border-slate-800">
                Event Logistics
              </h3>

              {/* Timing */}
              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy-950 flex items-center justify-center text-acm-cyan border border-slate-800 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono text-[10px] uppercase">Date</span>
                    <p className="font-medium text-white text-xs">
                      {endDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy-950 flex items-center justify-center text-acm-cyan border border-slate-800 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono text-[10px] uppercase">Timing</span>
                    <p className="font-medium text-white text-xs">
                      {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy-950 flex items-center justify-center text-acm-cyan border border-slate-800 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono text-[10px] uppercase">Location / Venue</span>
                    <p className="font-medium text-white text-xs">
                      {event.venue || 'Mohan Babu University Campus'}
                    </p>
                  </div>
                </div>

                {event.registration_deadline && (
                  <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 text-slate-300">
                    <span className="text-slate-400 text-[10px] font-mono uppercase block">Registration Deadline</span>
                    <p className={`font-semibold text-xs mt-0.5 ${isDeadlinePassed ? 'text-amber-400' : 'text-acm-light'}`}>
                      {new Date(event.registration_deadline).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Registration (Google Form) */}
              <div className="pt-2 space-y-3">
                {isPast ? (
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center text-xs text-slate-400">
                    This event has ended.
                  </div>
                ) : isDeadlinePassed ? (
                  <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center text-xs text-amber-300">
                    Registration deadline has passed.
                  </div>
                ) : !event.registration_enabled ? (
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center text-xs text-slate-400">
                    Registrations are closed for this event.
                  </div>
                ) : event.registration_url ? (
                  <>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Registration for this event is done through a Google Form. Fill it in to confirm your spot.
                    </p>
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-acm-primary w-full text-center py-3 text-sm flex items-center justify-center gap-2"
                    >
                      <span>Register via Google Form</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-800 text-slate-400 text-xs text-center">
                    The registration form will be announced shortly.
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
