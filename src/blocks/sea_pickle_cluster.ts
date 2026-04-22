// Sea pickles grow in clusters of 1-4 on coral/blocks underwater.
// Emit light when waterlogged; dry pickles don't emit light.

export interface SeaPickleState {
  count: 1 | 2 | 3 | 4;
  waterlogged: boolean;
}

export function lightLevel(s: SeaPickleState): number {
  if (!s.waterlogged) return 0;
  // Waterlogged: 6 + 3*(count-1) = 6,9,12,15
  return 6 + 3 * (s.count - 1);
}

export function bonemealGrow(s: SeaPickleState): SeaPickleState {
  if (s.count >= 4) return s;
  return { count: (s.count + 1) as 1 | 2 | 3 | 4, waterlogged: s.waterlogged };
}

export function placeCountOnCluster(existing: SeaPickleState): SeaPickleState {
  if (existing.count >= 4) return existing;
  return { count: (existing.count + 1) as 1 | 2 | 3 | 4, waterlogged: existing.waterlogged };
}
