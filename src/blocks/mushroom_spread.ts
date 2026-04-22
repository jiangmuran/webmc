// Mushrooms spread in low light (< 12) to any valid soil with an even
// lower-lit adjacent cell. They also grow large via bone-meal into a
// huge red/brown mushroom structure.

export const MAX_LIGHT_FOR_MUSHROOM = 12;
export const CLUSTER_MAX = 5;

export interface SpreadQuery {
  lightAtHere: number;
  lightAtNeighbor: number;
  neighborValidSoil: boolean;
  nearbyMushroomCount: number; // within a 9x9x3 area
  rand: () => number;
}

export function canSpread(q: SpreadQuery): boolean {
  if (q.lightAtHere > MAX_LIGHT_FOR_MUSHROOM) return false;
  if (q.lightAtNeighbor > MAX_LIGHT_FOR_MUSHROOM) return false;
  if (!q.neighborValidSoil) return false;
  if (q.nearbyMushroomCount >= CLUSTER_MAX) return false;
  return q.rand() < 0.04;
}

// Bone meal → huge mushroom (random 1–2 stem column + cap). Returns
// expected placed blocks count (approx).
export interface HugeGrowQuery {
  mushroomId: 'webmc:red_mushroom' | 'webmc:brown_mushroom';
  rand: () => number;
}

export function hugeMushroomBlockCount(q: HugeGrowQuery): number {
  const height = 4 + Math.floor(q.rand() * 3);
  const capBlocks = q.mushroomId === 'webmc:red_mushroom' ? 9 : 12;
  return height + capBlocks;
}

// Valid soil: mycelium, podzol, nylium (nether), or any full block with
// low light.
const SOIL_IDS = new Set<string>([
  'webmc:mycelium',
  'webmc:podzol',
  'webmc:crimson_nylium',
  'webmc:warped_nylium',
]);

export function isValidSoil(blockId: string, lightLevel: number): boolean {
  if (SOIL_IDS.has(blockId)) return true;
  return lightLevel <= MAX_LIGHT_FOR_MUSHROOM;
}
