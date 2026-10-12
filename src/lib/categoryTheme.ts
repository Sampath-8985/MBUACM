export interface CategoryTheme {
  bg: string;
  text: string;
  border: string;
}

const KNOWN: Record<string, CategoryTheme> = {
  hackathon: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' },
  workshop: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  talk: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
  contest: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  general: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
};

// Colours for categories added by the admin (picked from the id so it stays stable)
const PALETTE: CategoryTheme[] = [
  { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  { bg: 'bg-pink-500/15', text: 'text-pink-300', border: 'border-pink-500/30' },
  { bg: 'bg-lime-500/15', text: 'text-lime-300', border: 'border-lime-500/30' },
  { bg: 'bg-orange-500/15', text: 'text-orange-300', border: 'border-orange-500/30' },
  { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/30' },
  { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30' },
];

export function categoryTheme(id?: string): CategoryTheme {
  const key = id || 'general';
  if (KNOWN[key]) return KNOWN[key];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}
