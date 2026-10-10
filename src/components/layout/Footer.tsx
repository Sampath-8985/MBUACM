import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  MapPin, 
  Globe, 
  ExternalLink,
  Heart
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '../ui/SocialIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Col 1 & 2: Chapter Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-acm-blue to-cyan-400 shadow-glow-sm shrink-0">
                <img
                  src="/logo.png"
                  alt="MBU ACM Student Chapter Logo"
                  className="w-full h-full object-contain rounded-full bg-navy-950 p-0.5"
                />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white">MBU ACM Student Chapter</span>
                <p className="text-xs text-acm-cyan font-mono">Advancing Computing as a Science & Profession</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering Mohan Babu University engineering students through cutting-edge technology workshops, national hackathons, competitive programming, and research mentorship.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-acm-cyan shrink-0 mt-0.5" />
                <span>Mohan Babu University, Sree Sainath Nagar, Tirupati, Andhra Pradesh - 517102</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-acm-cyan shrink-0" />
                <a href="mailto:acm@mbu.asia" className="hover:text-acm-light transition-colors">
                  acm@mbu.asia
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Chapter</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">All Events & Hackathons</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">Past Events Gallery</Link>
              </li>
              <li>
                <Link to="/crew" className="hover:text-white transition-colors">Executive Crew</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Student Portals */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Student Hub
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">Student Profile</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Sign In Portal</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">Chapter Registration</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-purple-300 transition-colors flex items-center gap-1">
                  <span>Admin Gateway</span>
                  <ExternalLink className="w-3 h-3 text-purple-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Global ACM & Social */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Connect With Us
            </h4>
            <div className="flex items-center gap-3 mb-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-navy-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-acm-cyan hover:bg-slate-800 transition-all"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-navy-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-acm-cyan hover:bg-slate-800 transition-all"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-navy-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-acm-cyan hover:bg-slate-800 transition-all"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-navy-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-acm-cyan hover:bg-slate-800 transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>

            <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-800 text-xs">
              <p className="text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-acm-cyan" /> ACM Global
              </p>
              <a
                href="https://www.acm.org"
                target="_blank"
                rel="noreferrer"
                className="text-acm-light hover:underline flex items-center gap-1"
              >
                Visit ACM.org <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MBU ACM Student Chapter. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by MBU ACM Webmasters
          </p>
        </div>
      </div>
    </footer>
  );
};
