// Background music track selection. Weighted by dimension + biome + time.

export interface MusicCtx {
  dimension: 'overworld' | 'nether' | 'the_end';
  biomeTag: 'normal' | 'forest' | 'ocean' | 'snowy' | 'desert' | 'jungle' | 'mesa' | 'cave';
  isNight: boolean;
  inCombat: boolean;
}

export type TrackId = string;

export interface TrackPool {
  id: TrackId;
  weight: number;
}

const POOLS: Record<string, TrackPool[]> = {
  overworld_day: [
    { id: 'calm_overworld_1', weight: 10 },
    { id: 'calm_overworld_2', weight: 10 },
    { id: 'calm_overworld_3', weight: 10 },
  ],
  overworld_night: [{ id: 'night_overworld_1', weight: 20 }],
  overworld_cave: [{ id: 'cave_ambient', weight: 20 }],
  nether: [
    { id: 'nether_1', weight: 10 },
    { id: 'nether_2', weight: 10 },
  ],
  the_end: [{ id: 'end_boss', weight: 20 }],
  combat: [{ id: 'combat_sting', weight: 30 }],
};

export function poolKey(c: MusicCtx): string {
  if (c.inCombat) return 'combat';
  if (c.dimension === 'nether') return 'nether';
  if (c.dimension === 'the_end') return 'the_end';
  if (c.biomeTag === 'cave') return 'overworld_cave';
  return c.isNight ? 'overworld_night' : 'overworld_day';
}

export function pickTrack(c: MusicCtx, rand: () => number): TrackId {
  const pool = POOLS[poolKey(c)];
  if (!pool || pool.length === 0) return 'silent';
  const total = pool.reduce((s, t) => s + t.weight, 0);
  let r = rand() * total;
  for (const t of pool) {
    if (r < t.weight) return t.id;
    r -= t.weight;
  }
  return pool[pool.length - 1]?.id ?? 'silent';
}

export const SILENCE_BETWEEN_TRACKS_SEC_MIN = 300;
export const SILENCE_BETWEEN_TRACKS_SEC_MAX = 900;
