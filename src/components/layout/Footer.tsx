import React from 'react';
import { Link } from 'react-router-dom';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '../ui/SocialIcons';

const socialClass =
  'w-8 h-8 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40 transition-colors';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-ink font-jakarta text-white/70 pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 pb-10">

          {/* Chapter Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="MBU ACM Student Chapter Logo"
                className="w-10 h-10 rounded-full object-contain bg-white ring-2 ring-white/70 shrink-0"
              />
              <div className="leading-tight">
                <span className="block font-bold text-[15px] text-white">ACM Student Chapter</span>
                <span className="block text-[11px] text-white/60">Mohan Babu University</span>
              </div>
            </div>

            <p className="text-[13px] leading-relaxed max-w-xs">
              Workshops, hackathons, competitive programming and research mentorship for engineering students at MBU.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a href="https://github.com" target="_blank" rel="noreferrer" className={socialClass} aria-label="GitHub">
                <GithubIcon className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={socialClass} aria-label="LinkedIn">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className={socialClass} aria-label="Twitter">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={socialClass} aria-label="Instagram">
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Site links */}
          <div>
            <h4 className="text-[13px] font-bold text-white mb-4">Site</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/crew" className="hover:text-white transition-colors">Core Team</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li>
                <a href="https://www.acm.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  ACM.org
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[13px] font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2.5 text-[13px] leading-relaxed">
              <li>Mohan Babu University, Sree Sainath Nagar, Tirupati, Andhra Pradesh - 517102</li>
              <li>
                <a href="mailto:acm@mbu.asia" className="hover:text-white transition-colors">acm@mbu.asia</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4 text-[11px] text-white/50">
          <p>© {new Date().getFullYear()} MBU ACM Student Chapter</p>
          <Link to="/admin/login" className="hover:text-white transition-colors">Admin login</Link>
        </div>
      </div>
    </footer>
  );
};
