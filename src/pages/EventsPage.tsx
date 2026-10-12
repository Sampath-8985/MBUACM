import React, { useEffect, useState } from 'react';
import { ClubEvent } from '../types';
import { getEvents } from '../services/events';
import { EventCard } from '../components/events/EventCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Calendar, Search, Filter, Sparkles } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { categories: categoryList } = useCategories();

  useEffect(() => {
    async function loadEventsData() {
      setLoading(true);
      try {
        const publishedEvents = await getEvents(false); // Only published events
        setEvents(publishedEvents);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEventsData();
  }, []);

  // Keep the category chip in sync with the search box
  useEffect(() => {
    setCategoryFilter('all');
  }, [searchTerm]);

  const categories = [{ id: 'all', label: 'All Categories' }, ...categoryList];

  // Filtering logic
  const now = Date.now();
  const filteredEvents = events.filter((event) => {
    // 1. Search term
    const matchesSearch =
      event.title.includes(searchTerm) ||
      (event.summary && event.summary.includes(searchTerm)) ||
      (event.venue && event.venue.includes(searchTerm));

    if (!matchesSearch) return false;

    // 2. Time filter
    const isPast = new Date(event.end_at).getTime() < now || event.status === 'completed';
    if (timeFilter === 'upcoming' && isPast) return false;
    if (timeFilter === 'past' && !isPast) return false;

    // 3. Category filter
    if (categoryFilter !== 'all' && event.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-acm-cyan/15 text-acm-light border border-acm-cyan/30 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5 text-acm-cyan" />
            <span>Chapter Activities & Calendar</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
            Events & Hackathons
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Discover upcoming national hackathons, technical masterclasses, speaker sessions, and coding contests at Mohan Babu University.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="glass-panel p-5 border border-slate-800 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events by title, topic, or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-acm-cyan focus:ring-1 focus:ring-acm-cyan transition-all"
              />
            </div>

            {/* Time Filter Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-navy-950/80 border border-slate-800 self-start">
              <button
                onClick={() => setTimeFilter('upcoming')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeFilter === 'upcoming'
                    ? 'bg-gradient-to-r from-acm-blue to-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setTimeFilter('past')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeFilter === 'past'
                    ? 'bg-gradient-to-r from-acm-blue to-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Past Events
              </button>
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeFilter === 'all'
                    ? 'bg-gradient-to-r from-acm-blue to-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Filter by:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-acm-cyan/20 text-acm-cyan border border-acm-cyan/50 font-semibold'
                    : 'bg-navy-950/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <LoadingSpinner message="Fetching published events..." />
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-16 text-center text-slate-400 border border-slate-800">
            <Calendar className="w-14 h-14 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No matching events found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {timeFilter === 'upcoming'
                ? 'There are currently no upcoming events matching your filter criteria. Switch to "Past Events" or reset your search.'
                : 'No events found matching your query.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setTimeFilter('all');
              }}
              className="mt-6 btn-acm-secondary text-xs px-4 py-2"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
