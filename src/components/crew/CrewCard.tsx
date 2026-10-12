import React from 'react';
import { CrewMember } from '../../types';
import { Mail, User } from 'lucide-react';
import { LinkedinIcon, GithubIcon, TwitterIcon } from '../ui/SocialIcons';

interface CrewCardProps {
  member: CrewMember;
}

export const CrewCard: React.FC<CrewCardProps> = ({ member }) => {
  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="glass-card-interactive rounded-2xl p-5 flex flex-col items-center text-center group h-full">
      {/* Avatar Container with Gradient Border */}
      <div className="relative mb-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-0.5 bg-gradient-to-tr from-acm-blue via-acm-cyan to-purple-500 shadow-glow-sm group-hover:shadow-glow group-hover:scale-105 transition-all duration-300">
          <div className="w-full h-full rounded-[14px] overflow-hidden bg-navy-950">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultAvatar;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 bg-navy-900">
                <User className="w-10 h-10 text-acm-cyan/60" />
              </div>
            )}
          </div>
        </div>
        <span className="absolute -bottom-2 inset-x-0 mx-auto w-fit text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-navy-950/90 text-acm-light border border-acm-cyan/40">
          #{member.display_order}
        </span>
      </div>

      {/* Member Details */}
      <div className="flex-1 flex flex-col justify-between w-full space-y-2 mt-1">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-acm-cyan transition-colors">
            {member.name}
          </h3>
          <p className="text-xs font-semibold text-acm-light mt-0.5">
            {member.role}
          </p>

          {(member.branch || member.academic_year) && (
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {[member.branch, member.academic_year].filter(Boolean).join(' • ')}
            </p>
          )}

          {member.bio && (
            <p className="text-xs text-slate-300/80 leading-relaxed mt-2.5 line-clamp-3">
              {member.bio}
            </p>
          )}
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2">
          {member.social_links?.linkedin && (
            <a
              href={member.social_links.github}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 hover:border-acm-cyan/50 border border-transparent transition-all"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
          {member.social_links?.github && (
            <a
              href={member.social_links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 hover:border-acm-cyan/50 border border-transparent transition-all"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {member.social_links?.twitter && (
            <a
              href={member.social_links.twitter}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 hover:border-acm-cyan/50 border border-transparent transition-all"
              aria-label="Twitter"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
          )}
          {member.social_links?.email && (
            <a
              href={`mailto:${member.social_links.email}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 hover:border-acm-cyan/50 border border-transparent transition-all"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
