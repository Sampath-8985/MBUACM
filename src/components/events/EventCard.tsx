import React from 'react';
import { Link } from 'react-router-dom';
import { ClubEvent } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { categoryTheme } from '../../lib/categoryTheme';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Clock,
  Sparkles
} from 'lucide-react';

interface EventCardProps {
  event: ClubEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { labelFor } = useCategories();
  const startDate = new Date(event.start_at);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isPast = new Date(event.end_at).getTime() < Date.now();
  const isDeadlinePassed = event.registration_deadline
    ? new Date(event.registration_deadline).getTime() < Date.now()
    : false;

  const defaultPoster = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800';

  const theme = categoryTheme(event.category);
  const cat = { label: labelFor(event.category), color: `${theme.bg} ${theme.text} ${theme.border}` };

  return (
    <div className="glass-card-interactive rounded-2xl overflow-hidden flex flex-col group h-full">
      {/* Poster Media Box */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-navy-950">
        <img
          src={event.poster_url || defaultPoster}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultPoster;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${cat.color}`}>
            {cat.label}
          </span>
        </div>

        {/* Registration status badge */}
        <div className="absolute top-3 right-3">
          {isDeadlinePassed || !event.registration_enabled ? (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Registrations Closed
            </span>
          ) : event.status === 'completed' || isPast ? (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-400 border border-slate-700">
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-400 text-navy-950 animate-pulse">
              <Sparkles className="w-3 h-3" /> Open Now
            </span>
          )}
        </div>

        {/* Date banner at bottom of poster */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-1.5 font-medium bg-navy-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-acm-cyan" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <h3 className="font-display font-bold text-lg text-white group-hover:text-acm-light transition-colors line-clamp-2">
            {event.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
            {event.summary || event.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{event.venue || 'Mohan Babu University'}</span>
          </div>
        </div>

        {/* Action Link */}
        <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
          {event.registration_deadline && !isPast && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-acm-cyan" />
              Deadline: {new Date(event.registration_deadline).toLocaleDateString()}
            </span>
          )}
          <Link
            to={`/events/${event.id}`}
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-acm-cyan hover:text-white transition-colors group-hover:translate-x-1 duration-200"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
