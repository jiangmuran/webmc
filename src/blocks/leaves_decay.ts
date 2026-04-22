// Leaf decay. Natural leaves have a "distance" (1..7) to the nearest
// log. If >6, they decay into drops. Persistent leaves (placed by
// player with shears) never decay.

export interface Leaves {
  distanceToLog: number; // 1..7 (7 = too far)
  persistent: boolean;
}

export const MAX_DISTANCE = 7;

export function shouldDecay(l: Leaves): boolean {
  if (l.persistent) return false;
  return l.distanceToLog >= MAX_DISTANCE;
}

// Compute distance from a 6-neighbor check: distance = 1 + min(neighborDistance),
// where a log gives distance 0. -1 = not connected.
export interface ComputeQuery {
  adjacentLog: boolean;
  neighborLeafDistances: number[]; // 1..7 each
}

export function computeDistance(q: ComputeQuery): number {
  if (q.adjacentLog) return 1;
  const min = q.neighborLeafDistances.reduce((a, b) => Math.min(a, b), MAX_DISTANCE);
  return Math.min(MAX_DISTANCE, min + 1);
}

// Drop table on decay: sapling(~5%), apple(if oak/dark_oak, 1/200),
// sticks(2%).
export interface DropRoll {
  leafId: string;
  fortuneLevel: number;
  rand: () => number;
}

export function decayDrops(q: DropRoll): { id: string; count: number }[] {
  const out: { id: string; count: number }[] = [];
  const sapPer = 0.05 + q.fortuneLevel * 0.005;
  if (q.rand() < sapPer) out.push({ id: saplingFor(q.leafId), count: 1 });
  if (
    (q.leafId === 'webmc:oak_leaves' || q.leafId === 'webmc:dark_oak_leaves') &&
    q.rand() < 1 / 200
  ) {
    out.push({ id: 'webmc:apple', count: 1 });
  }
  if (q.rand() < 0.02) out.push({ id: 'webmc:stick', count: 1 });
  return out;
}

function saplingFor(leafId: string): string {
  return leafId.replace('_leaves', '_sapling');
}
