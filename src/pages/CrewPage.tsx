import React, { useEffect, useState } from 'react';
import { CrewMember } from '../types';
import { getCrew } from '../services/crew';
import { CrewCard } from '../components/crew/CrewCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Users, Sparkles } from 'lucide-react';

export const CrewPage: React.FC = () => {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCrew() {
      setLoading(true);
      try {
        const members = await getCrew(false); // Only published crew members
        setCrew([...members].sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error('Failed to load crew members:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCrew();
  }, []);

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-acm-cyan/15 text-acm-light border border-acm-cyan/30 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5 text-acm-cyan" />
            <span>Chapter Leadership & Operations</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
            Meet the MBU ACM Crew
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            A passionate team of student innovators, software architects, competitive programmers, and faculty mentors driving the Mohan Babu University ACM Student Chapter forward.
          </p>
        </div>

        {/* Crew Grid */}
        {loading ? (
          <LoadingSpinner message="Loading executive crew members..." />
        ) : crew.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {crew.map((member) => (
              <CrewCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-16 text-center text-slate-400 border border-slate-800">
            <Users className="w-14 h-14 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No crew members published yet</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              The chapter leadership team is currently finalizing executive appointments. Check back soon!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
