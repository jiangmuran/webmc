// Music disc registry. Each disc has a name, approximate duration, and
// drop source. 5 Creakings play in jukeboxes; some drops from specific
// mobs, some from structures.

export type DiscSource =
  | 'skeleton_kills_creeper'
  | 'woodland_mansion'
  | 'dungeon'
  | 'nether_fortress'
  | 'ancient_city'
  | 'trial_chambers'
  | 'buried_treasure'
  | 'pillager_raid'
  | 'trail_ruins'
  | 'fishing';

export interface MusicDiscDef {
  id: string;
  title: string;
  durationSec: number;
  composer: string;
  source: DiscSource;
}

export const MUSIC_DISCS: readonly MusicDiscDef[] = [
  { id: '13', title: '13', durationSec: 178, composer: 'C418', source: 'dungeon' },
  { id: 'cat', title: 'cat', durationSec: 185, composer: 'C418', source: 'dungeon' },
  {
    id: 'blocks',
    title: 'blocks',
    durationSec: 345,
    composer: 'C418',
    source: 'skeleton_kills_creeper',
  },
  {
    id: 'chirp',
    title: 'chirp',
    durationSec: 185,
    composer: 'C418',
    source: 'skeleton_kills_creeper',
  },
  { id: 'far', title: 'far', durationSec: 174, composer: 'C418', source: 'skeleton_kills_creeper' },
  {
    id: 'mall',
    title: 'mall',
    durationSec: 197,
    composer: 'C418',
    source: 'skeleton_kills_creeper',
  },
  {
    id: 'mellohi',
    title: 'mellohi',
    durationSec: 96,
    composer: 'C418',
    source: 'skeleton_kills_creeper',
  },
  {
    id: 'stal',
    title: 'stal',
    durationSec: 150,
    composer: 'C418',
    source: 'skeleton_kills_creeper',
  },
  {
    id: 'strad',
    title: 'strad',
    durationSec: 188,
    composer: 'C418',
    source: 'skeleton_kills_creeper',
  },
  {
    id: 'ward',
    title: 'ward',
    durationSec: 251,
    composer: 'C418',
    source: 'skeleton_kills_creeper',
  },
  { id: '11', title: '11', durationSec: 71, composer: 'C418', source: 'skeleton_kills_creeper' },
  {
    id: 'wait',
    title: 'wait',
    durationSec: 238,
    composer: 'C418',
    source: 'skeleton_kills_creeper',
  },
  {
    id: 'pigstep',
    title: 'pigstep',
    durationSec: 149,
    composer: 'Lena Raine',
    source: 'nether_fortress',
  },
  {
    id: 'otherside',
    title: 'otherside',
    durationSec: 195,
    composer: 'Lena Raine',
    source: 'dungeon',
  },
  { id: '5', title: '5', durationSec: 178, composer: 'Samuel Åberg', source: 'ancient_city' },
  {
    id: 'relic',
    title: 'relic',
    durationSec: 218,
    composer: 'Aaron Cherof',
    source: 'trail_ruins',
  },
  {
    id: 'precipice',
    title: 'precipice',
    durationSec: 218,
    composer: 'Aaron Cherof',
    source: 'trial_chambers',
  },
  {
    id: 'creator',
    title: 'creator',
    durationSec: 176,
    composer: 'Lena Raine',
    source: 'trial_chambers',
  },
  {
    id: 'creator_music_box',
    title: 'creator (music box)',
    durationSec: 73,
    composer: 'Lena Raine',
    source: 'trial_chambers',
  },
];

export function discById(id: string): MusicDiscDef | null {
  return MUSIC_DISCS.find((d) => d.id === id) ?? null;
}

export function discsBySource(source: DiscSource): readonly MusicDiscDef[] {
  return MUSIC_DISCS.filter((d) => d.source === source);
}

// Jukebox state.
export interface JukeboxState {
  currentDisc: string | null;
  elapsedSec: number;
}

export function makeJukebox(): JukeboxState {
  return { currentDisc: null, elapsedSec: 0 };
}

export function insertDisc(state: JukeboxState, id: string): boolean {
  if (state.currentDisc !== null) return false;
  const d = discById(id);
  if (!d) return false;
  state.currentDisc = id;
  state.elapsedSec = 0;
  return true;
}

export function tickJukebox(state: JukeboxState, dtSec: number): 'playing' | 'finished' {
  if (state.currentDisc === null) return 'finished';
  const d = discById(state.currentDisc);
  if (!d) return 'finished';
  state.elapsedSec += dtSec;
  if (state.elapsedSec >= d.durationSec) return 'finished';
  return 'playing';
}
