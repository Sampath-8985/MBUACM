import { Megaphone, Code2, PenLine, FileText, Palette, ClipboardList, type LucideIcon } from 'lucide-react';

// The six teams of the chapter (shown on the Home and About pages)
export const teams: {
  name: string;
  tagline: string;
  summary: string;
  icon: LucideIcon;
  accent: string;
  duties: string[];
  skills: string[];
}[] = [
  {
    name: 'PR Team',
    summary: 'Invites speakers and sponsors and spreads the word about every event.',
    tagline: 'Outreach and communication',
    icon: Megaphone,
    accent: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    duties: [
      'Invite speakers, judges and guests for events',
      'Reach out to sponsors, companies and other college chapters',
      'Spread the word about every event to students and faculty',
    ],
    skills: ['Communication', 'Networking', 'Negotiation'],
  },
  {
    name: 'Web Development Team',
    summary: 'Builds and maintains this website and the tools behind events.',
    tagline: 'Website and event tools',
    icon: Code2,
    accent: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    duties: [
      'Build and maintain the chapter website',
      'Publish events, galleries and team pages',
      'Create small tools for registrations and event day',
    ],
    skills: ['React', 'Firebase', 'Tailwind CSS'],
  },
  {
    name: 'Draft Team',
    summary: 'Writes the letters, emails and announcements for the chapter.',
    tagline: 'Letters, emails and content',
    icon: PenLine,
    accent: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    duties: [
      'Write permission letters and event proposals',
      'Draft invitations, sponsorship emails and announcements',
      'Prepare event descriptions and press notes',
    ],
    skills: ['Writing', 'Formal drafting', 'Proofreading'],
  },
  {
    name: 'Documentation Team',
    summary: 'Records every event with reports, attendance and photos.',
    tagline: 'Records and reports',
    icon: FileText,
    accent: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    duties: [
      'Write a report after every event',
      'Keep attendance, participation and feedback records',
      'Collect photos and organise the chapter archive',
    ],
    skills: ['Reports', 'Record keeping', 'Photography'],
  },
  {
    name: 'Poster Team',
    summary: 'Designs posters, banners, certificates and social media creatives.',
    tagline: 'Design and creatives',
    icon: Palette,
    accent: 'bg-pink-500/15 border-pink-500/30 text-pink-300',
    duties: [
      'Design posters and banners for every event',
      'Make certificates and social media creatives',
      'Keep the chapter look consistent across everything',
    ],
    skills: ['Canva', 'Figma', 'Graphic design'],
  },
  {
    name: 'Management Team',
    summary: 'Plans schedules, venues and volunteers, and runs events on the day.',
    tagline: 'Planning and event day',
    icon: ClipboardList,
    accent: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
    duties: [
      'Plan schedules, venues, budgets and logistics',
      'Coordinate volunteers and the other teams',
      'Run the event on the day and follow up afterwards',
    ],
    skills: ['Planning', 'Coordination', 'Leadership'],
  },
];

