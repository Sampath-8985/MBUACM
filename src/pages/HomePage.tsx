import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Users, 
  Trophy, 
  Code2, 
  Cpu, 
  Terminal, 
  Rocket, 
  BookOpen, 
  CheckCircle,
  ExternalLink,
  Images
} from 'lucide-react';
import { getEvents } from '../services/events';
import { getCrew } from '../services/crew';
import { ClubEvent, CrewMember } from '../types';
import { EventCard } from '../components/events/EventCard';
import { CrewCard } from '../components/crew/CrewCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const HomePage: React.FC = () => {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedEvents, loadedCrew] = await Promise.all([
          getEvents(false),
          getCrew(false),
        ]);
        setEvents(loadedEvents);
        setCrew(loadedCrew.slice(0, 4)); // Show top 4 leaders on home
      } catch (e) {
        console.error('Error loading home data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const upcomingEvents = events
    .filter((e) => e.status === 'published' && new Date(e.end_at).getTime() >= Date.now())
    .slice(0, 3);

  return (
    <div className="relative overflow-hidden">
      {/* Background Cyber Glow Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-acm-blue/15 via-acm-cyan/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* ========================================================
          HERO SECTION
      ======================================================== */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Chapter Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 border border-acm-cyan/30 text-xs text-acm-light font-mono shadow-glow-sm mb-6 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5 text-acm-cyan" />
            <span>Mohan Babu University • Official ACM Chapter</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Where Code Meets Ambition,{' '}
            <span className="text-gradient-acm">
              Innovation Ignites.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to the premier computing community at Mohan Babu University. We build cutting-edge systems, conquer national hackathons, and shape tomorrow’s tech leaders.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/events"
              className="btn-acm-primary px-7 py-3 text-base shadow-glow hover:shadow-glow-lg"
            >
              <span>Explore Events & Hackathons</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="btn-acm-secondary px-6 py-3 text-base"
            >
              <span>About Chapter</span>
            </Link>
          </div>

          {/* Interactive Stats Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="glass-panel p-5 border border-slate-800">
              <div className="flex items-center justify-between text-acm-cyan mb-2">
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-mono uppercase text-slate-400">Community</span>
              </div>
              <p className="font-display font-bold text-2xl sm:text-3xl text-white">500+</p>
              <p className="text-xs text-slate-400 mt-1">Active Student Members</p>
            </div>

            <div className="glass-panel p-5 border border-slate-800">
              <div className="flex items-center justify-between text-purple-400 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-[10px] font-mono uppercase text-slate-400">Initiatives</span>
              </div>
              <p className="font-display font-bold text-2xl sm:text-3xl text-white">25+</p>
              <p className="text-xs text-slate-400 mt-1">Annual Tech Workshops</p>
            </div>

            <div className="glass-panel p-5 border border-slate-800">
              <div className="flex items-center justify-between text-amber-400 mb-2">
                <Trophy className="w-5 h-5" />
                <span className="text-[10px] font-mono uppercase text-slate-400">Hackathons</span>
              </div>
              <p className="font-display font-bold text-2xl sm:text-3xl text-white">₹1.5L+</p>
              <p className="text-xs text-slate-400 mt-1">Prizes & Bounties</p>
            </div>

            <div className="glass-panel p-5 border border-slate-800">
              <div className="flex items-center justify-between text-emerald-400 mb-2">
                <Terminal className="w-5 h-5" />
                <span className="text-[10px] font-mono uppercase text-slate-400">Excellence</span>
              </div>
              <p className="font-display font-bold text-2xl sm:text-3xl text-white">100%</p>
              <p className="text-xs text-slate-400 mt-1">Student Driven & Mentored</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          UPCOMING EVENTS HIGHLIGHT
      ======================================================== */}
      <section className="py-16 bg-navy-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-acm-cyan mb-2 uppercase tracking-wider font-semibold">
                <Calendar className="w-3.5 h-3.5" /> What’s Happening
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                Featured & Upcoming Events
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-acm-light hover:text-white transition-colors"
            >
              <span>View All Events ({events.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading upcoming chapter events..." />
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-10 text-center text-slate-400">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-base text-slate-300 font-medium">No upcoming events scheduled right now.</p>
              <p className="text-xs text-slate-400 mt-1">Check back soon for new hackathons and workshops!</p>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          CHAPTER PILLARS
      ======================================================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-acm-cyan font-semibold">
              The Four Pillars of MBU ACM
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2 tracking-tight">
              Fueling Your Engineering Journey
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              We provide the ecosystem, resources, and peers needed to transform curious students into world-class software engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="glass-panel p-6 border border-slate-800/80 hover:border-acm-cyan/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-acm-cyan mb-5 group-hover:scale-110 transition-transform">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white group-hover:text-acm-cyan transition-colors">
                Hackathons & Sprints
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                From fast-paced internal ideathons to the 36-hour national HackSprint, build real-world solutions under real-time constraints.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="glass-panel p-6 border border-slate-800/80 hover:border-acm-cyan/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                Cutting-Edge Workshops
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                Hands-on masterclasses in Generative AI, Cloud Systems, Kubernetes, Web3, and Full Stack Engineering by student mentors and guests.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="glass-panel p-6 border border-slate-800/80 hover:border-acm-cyan/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                Competitive Coding (CP)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                Rigorous algorithmic preparation for ICPC, Codeforces rounds, and FAANG interviews with dedicated problem-solving cohorts.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="glass-panel p-6 border border-slate-800/80 hover:border-acm-cyan/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                Research & Mentorship
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                Connect with ACM Digital Library resources, faculty mentors, and alumni working in top research labs and global tech giants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CREW SPOTLIGHT
      ======================================================== */}
      <section className="py-16 bg-navy-900/30 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-acm-cyan font-semibold">
                People Behind the Chapter
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mt-1">
                Executive Leadership
              </h2>
            </div>
            <Link
              to="/crew"
              className="inline-flex items-center gap-2 text-sm font-semibold text-acm-light hover:text-white transition-colors"
            >
              <span>View All Crew Members</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading crew highlights..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {crew.map((member) => (
                <CrewCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          EVENT GALLERY & MEMORY VAULT SPOTLIGHT
      ======================================================== */}
      <section className="py-20 border-t border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-acm-cyan/15 text-acm-light border border-acm-cyan/30 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
                <Images className="w-3.5 h-3.5 text-acm-cyan" />
                <span>Chapter Memories & Archives</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                Relive Past Events & <span className="text-gradient-acm">Moments</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl">
                Browse through photographs, student prototypes, mentor sessions, and awards ceremonies from our previous hackathons and tech bootcamps.
              </p>
            </div>

            <Link
              to="/gallery"
              className="btn-acm-secondary text-xs sm:text-sm px-5 py-2.5 flex items-center gap-2 self-start md:self-auto group"
            >
              <span>Explore All Event Photos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Visual Gallery Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/gallery"
              className="glass-panel group overflow-hidden rounded-2xl border border-slate-800 hover:border-acm-cyan/50 hover:shadow-glow transition-all"
            >
              <div className="relative h-48 overflow-hidden bg-navy-900">
                <img
                  src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800"
                  alt="HackSphere 2025"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold uppercase">
                  Hackathon
                </span>
                <span className="absolute bottom-3 right-3 text-xs font-mono text-cyan-300 bg-navy-950/80 px-2 py-0.5 rounded border border-slate-700/60">
                  📸 5 Photos
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-base text-white group-hover:text-acm-cyan transition-colors">
                  MBU HackSphere 2025: 24-Hour National Hackathon
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                  Over 200+ students built AI and Web3 solutions under mentorship from industry architects.
                </p>
              </div>
            </Link>

            <Link
              to="/gallery"
              className="glass-panel group overflow-hidden rounded-2xl border border-slate-800 hover:border-acm-cyan/50 hover:shadow-glow transition-all"
            >
              <div className="relative h-48 overflow-hidden bg-navy-900">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
                  alt="Generative AI Masterclass"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                  Workshop
                </span>
                <span className="absolute bottom-3 right-3 text-xs font-mono text-cyan-300 bg-navy-950/80 px-2 py-0.5 rounded border border-slate-700/60">
                  📸 3 Photos
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-base text-white group-hover:text-acm-cyan transition-colors">
                  Generative AI & Transformer Architectures
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                  Hands-on coding lab covering vector indexing, RAG systems, and LLM fine-tuning.
                </p>
              </div>
            </Link>

            <Link
              to="/gallery"
              className="glass-panel group overflow-hidden rounded-2xl border border-slate-800 hover:border-acm-cyan/50 hover:shadow-glow transition-all"
            >
              <div className="relative h-48 overflow-hidden bg-navy-900">
                <img
                  src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800"
                  alt="ACM Induction Expo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                  Campus Expo
                </span>
                <span className="absolute bottom-3 right-3 text-xs font-mono text-cyan-300 bg-navy-950/80 px-2 py-0.5 rounded border border-slate-700/60">
                  📸 3 Photos
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-base text-white group-hover:text-acm-cyan transition-colors">
                  ACM Chapter Induction & Annual Tech Expo
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                  300+ students joined hands-on robotics exhibits, open source roadmaps, and student stalls.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          CALL TO ACTION BANNER
      ======================================================== */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 border border-acm-cyan/30 shadow-glow">
            <div className="absolute top-0 right-0 w-80 h-80 bg-acm-cyan/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-acm-cyan/20 text-acm-light text-xs font-mono font-semibold uppercase tracking-wider border border-acm-cyan/30">
                Join Mohan Babu University ACM
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-4 tracking-tight leading-tight">
                Ready to level up your engineering skills?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
                Create your student account today to access priority event registration, digital badges, workshop resources, and chapter mentorship.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="btn-acm-primary px-6 py-3 text-sm font-semibold"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Student Account</span>
                </Link>
                <Link
                  to="/contact"
                  className="btn-acm-secondary px-6 py-3 text-sm"
                >
                  <span>Contact Chapter Team</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
