import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Target, 
  Eye, 
  Award, 
  CheckCircle2, 
  Globe, 
  Users, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-acm-cyan/15 text-acm-light border border-acm-cyan/30 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
              <Compass className="w-3.5 h-3.5 text-acm-cyan" />
              <span>About MBU ACM Chapter</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              Advancing Computing as a Science and a Passion.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
              The ACM Student Chapter at Mohan Babu University (MBU), Tirupati, is an officially chartered academic & student body dedicated to fostering technical curiosity, research mindset, and practical software engineering.
            </p>
          </div>
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-acm-blue via-cyan-400 to-acm-light shadow-glow shrink-0 self-center md:self-auto">
            <img
              src="/logo.png"
              alt="MBU ACM Student Chapter Official Seal"
              className="w-full h-full object-contain rounded-full bg-navy-950 p-1"
            />
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-panel p-8 border border-slate-800 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-acm-cyan mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">Our Mission</h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              To build an inclusive, collaborative ecosystem where engineering students acquire real-world computing proficiencies, develop innovative problem-solving mentalities, and contribute to national software challenges and academic research.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-acm-cyan shrink-0" />
                <span>Bridge university curriculum with modern industry tech stacks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-acm-cyan shrink-0" />
                <span>Nurture peer-led mentorship in AI, Cloud, and Systems</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-acm-cyan shrink-0" />
                <span>Promote open-source culture and competitive programming</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-8 border border-slate-800 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">Our Vision</h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              To be recognized as one of the most vibrant and impactful ACM student chapters across India, producing tech innovators, competitive programmers, and tech researchers who make tangible societal contributions.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Consistently rank among top regional ICPC contenders</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Host flagship inter-university national hackathons annually</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Foster ACM-W women in computing leadership at MBU</span>
              </li>
            </ul>
          </div>
        </div>

        {/* What We Do */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-bold text-3xl text-white tracking-tight">
              What We Do at Mohan Babu University
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Our initiatives span every stage of student engineering development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6 border border-slate-800">
              <Award className="w-8 h-8 text-acm-cyan mb-4" />
              <h3 className="font-display font-bold text-lg text-white">Flagship Hackathons</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                We organize HackSprint and internal coding sprints where students collaborate in multidisciplinary teams to build working prototypes within 36 hours.
              </p>
            </div>

            <div className="glass-panel p-6 border border-slate-800">
              <BookOpen className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="font-display font-bold text-lg text-white">Technical Masterclasses</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Hands-on training sessions covering Docker, Kubernetes, LangChain, React, Go, and PyTorch, led by experienced senior peers and alumni.
              </p>
            </div>

            <div className="glass-panel p-6 border border-slate-800">
              <Globe className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="font-display font-bold text-lg text-white">ACM Global Affiliation</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Access to the ACM Digital Library, discounted student certifications, special interest groups (SIGs), and a worldwide network of computing pioneers.
              </p>
            </div>

            <div className="glass-panel p-6 border border-slate-800">
              <Users className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="font-display font-bold text-lg text-white">Peer Mentorship</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Junior members receive dedicated guidance on resume building, open-source pull requests, GitHub portfolios, and tech interview preparation.
              </p>
            </div>

            <div className="glass-panel p-6 border border-slate-800">
              <ShieldCheck className="w-8 h-8 text-sky-400 mb-4" />
              <h3 className="font-display font-bold text-lg text-white">Competitive Programming</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Weekly problem sets, algorithmic workshops, and simulated contest environments designed for Codeforces, LeetCode, and ICPC regionals.
              </p>
            </div>

            <div className="glass-panel p-6 border border-slate-800">
              <Sparkles className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="font-display font-bold text-lg text-white">Industry Keynotes</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Direct AMAs and technical keynotes from staff engineers, engineering managers, and researchers from Google, Microsoft, Amazon, and research labs.
              </p>
            </div>
          </div>
        </div>

        {/* Chapter Achievements */}
        <div className="glass-panel p-8 sm:p-12 border border-slate-800 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <span className="text-xs font-mono uppercase tracking-widest text-acm-cyan font-semibold">
                Milestones & Impact
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-2 tracking-tight">
                Proud Chapter Achievements
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
                Highlights from our continuous journey of growth at Mohan Babu University.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-navy-950/60 border border-slate-800">
                <span className="font-display font-bold text-2xl text-acm-light">120+</span>
                <p className="text-xs font-semibold text-white mt-1">HackSprint Finalists</p>
                <p className="text-[11px] text-slate-400 mt-0.5">30 multidisciplinary project submissions showcased in 2025.</p>
              </div>

              <div className="p-4 rounded-xl bg-navy-950/60 border border-slate-800">
                <span className="font-display font-bold text-2xl text-purple-400">ICPC</span>
                <p className="text-xs font-semibold text-white mt-1">Regional Qualifiers</p>
                <p className="text-[11px] text-slate-400 mt-0.5">3 student teams represented MBU at the Amritapuri & Kanpur regionals.</p>
              </div>

              <div className="p-4 rounded-xl bg-navy-950/60 border border-slate-800">
                <span className="font-display font-bold text-2xl text-emerald-400">100%</span>
                <p className="text-xs font-semibold text-white mt-1">Free Student Workshops</p>
                <p className="text-[11px] text-slate-400 mt-0.5">All regular technical sessions offered free for enrolled students.</p>
              </div>

              <div className="p-4 rounded-xl bg-navy-950/60 border border-slate-800">
                <span className="font-display font-bold text-2xl text-amber-400">15+</span>
                <p className="text-xs font-semibold text-white mt-1">Open Source Projects</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Maintained by chapter student leads on our GitHub organization.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/crew"
            className="btn-acm-primary px-6 py-3 text-sm font-semibold inline-flex items-center gap-2"
          >
            <span>Meet Our Crew & Faculty Sponsor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
