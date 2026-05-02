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

// Wiki (minecraft.wiki/w/Sapling#Obtaining, /w/Oak_Leaves#Drops):
// sapling drop chance per fortune level — L0:1/20, L1:1/16, L2:1/12,
// L3:1/10, L4:1/8, L5:1/6 (oak/birch/spruce/acacia/cherry/mangrove/
// pale_oak). Jungle leaves are half that. Apple: 1/200 from oak and
// dark_oak. Old formula was a flat 5% + 0.5%/level, which under-shot
// every fortune level (Fortune III = 6.5% vs wiki 10%).
const SAPLING_CHANCE_BY_FORTUNE: Record<number, number> = {
  0: 1 / 20,
  1: 1 / 16,
  2: 1 / 12,
  3: 1 / 10,
  4: 1 / 8,
  5: 1 / 6,
};
const JUNGLE_DIVISOR = 2;

export interface DropRoll {
  leafId: string;
  fortuneLevel: number;
  rand: () => number;
}

function saplingChance(leafId: string, fortuneLevel: number): number {
  const base = SAPLING_CHANCE_BY_FORTUNE[Math.max(0, Math.min(5, fortuneLevel))] ?? 1 / 20;
  return leafId === 'webmc:jungle_leaves' ? base / JUNGLE_DIVISOR : base;
}

export function decayDrops(q: DropRoll): { id: string; count: number }[] {
  const out: { id: string; count: number }[] = [];
  if (q.rand() < saplingChance(q.leafId, q.fortuneLevel))
    out.push({ id: saplingFor(q.leafId), count: 1 });
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
