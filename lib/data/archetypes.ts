export type ArchetypeKey =
  | 'conductor'
  | 'choreographer'
  | 'composer'
  | 'sculptor'
  | 'painter'
  | 'director';

export interface ArchetypeVisual {
  key: ArchetypeKey;
  gradient: string;
  accentColor: string;
}

export const ARCHETYPE_VISUALS: ArchetypeVisual[] = [
  {
    key: 'conductor',
    gradient: 'from-rose-950 to-rose-800',
    accentColor: '#881337',
  },
  {
    key: 'choreographer',
    gradient: 'from-teal-900 to-teal-700',
    accentColor: '#134e4a',
  },
  {
    key: 'composer',
    gradient: 'from-indigo-950 to-violet-800',
    accentColor: '#312e81',
  },
  {
    key: 'sculptor',
    gradient: 'from-amber-900 to-orange-700',
    accentColor: '#78350f',
  },
  {
    key: 'painter',
    gradient: 'from-orange-700 to-rose-600',
    accentColor: '#9a3412',
  },
  {
    key: 'director',
    gradient: 'from-slate-900 to-slate-700',
    accentColor: '#0f172a',
  },
];

export const ARCHETYPE_KEYS: ArchetypeKey[] = [
  'conductor',
  'choreographer',
  'composer',
  'sculptor',
  'painter',
  'director',
];
