// Beds are used for sleep in the overworld, but explode if used in the
// Nether or the End (4.0 power TNT-like blast).

export type Dim = 'overworld' | 'nether' | 'end';

export interface BedUse {
  dim: Dim;
  isNight: boolean;
  monstersNearby: boolean;
}

export type BedResult =
  | { kind: 'sleep' }
  | { kind: 'explode'; power: number }
  | { kind: 'blocked_day' }
  | { kind: 'blocked_monsters' };

export const BED_EXPLOSION_POWER = 5;

export function useBed(q: BedUse): BedResult {
  if (q.dim !== 'overworld') {
    return { kind: 'explode', power: BED_EXPLOSION_POWER };
  }
  if (!q.isNight) return { kind: 'blocked_day' };
  if (q.monstersNearby) return { kind: 'blocked_monsters' };
  return { kind: 'sleep' };
}
