// Music selector by biome/dim. Each biome has a preferred music pool.
// A new track is chosen after a silence gap of 5-20 minutes (random).

export type Dim = 'overworld' | 'nether' | 'end';

export interface MusicPool {
  tracks: string[];
}

const POOLS: Record<string, MusicPool> = {
  creative: { tracks: ['creative_1', 'creative_2', 'creative_3', 'creative_4'] },
  menu: { tracks: ['menu_1', 'menu_2'] },
  game: { tracks: ['calm_1', 'calm_2', 'calm_3', 'hal_1', 'hal_2', 'nuance_1'] },
  nether: { tracks: ['nether_ambient_1', 'nether_ambient_2'] },
  nether_warped: { tracks: ['warped_1'] },
  nether_crimson: { tracks: ['crimson_1'] },
  nether_soulsand: { tracks: ['soulsand_1'] },
  nether_basalt: { tracks: ['basalt_1'] },
  end: { tracks: ['end_1'] },
  end_boss: { tracks: ['dragon_fight'] },
  ocean: { tracks: ['aquatic_ambient'] },
  deep_dark: { tracks: ['deep_dark_1', 'deep_dark_2'] },
};

export interface SelectQuery {
  dim: Dim;
  biome: string;
  isBoss: boolean;
}

export function pickPoolKey(q: SelectQuery): string {
  if (q.isBoss && q.dim === 'end') return 'end_boss';
  if (q.dim === 'end') return 'end';
  if (q.dim === 'nether') {
    if (q.biome === 'warped_forest') return 'nether_warped';
    if (q.biome === 'crimson_forest') return 'nether_crimson';
    if (q.biome === 'soul_sand_valley') return 'nether_soulsand';
    if (q.biome === 'basalt_deltas') return 'nether_basalt';
    return 'nether';
  }
  if (q.biome === 'deep_dark') return 'deep_dark';
  if (q.biome === 'ocean' || q.biome === 'deep_ocean') return 'ocean';
  return 'game';
}

export function pickTrack(q: SelectQuery, rand: () => number): string | null {
  const pool = POOLS[pickPoolKey(q)];
  if (!pool || pool.tracks.length === 0) return null;
  return pool.tracks[Math.floor(rand() * pool.tracks.length)] ?? null;
}

// Gap between tracks (in ticks, 20 Hz). 5..20 minutes.
export const MIN_GAP_TICKS = 5 * 60 * 20;
export const MAX_GAP_TICKS = 20 * 60 * 20;

export function nextGapTicks(rand: () => number): number {
  return Math.floor(MIN_GAP_TICKS + rand() * (MAX_GAP_TICKS - MIN_GAP_TICKS));
}
