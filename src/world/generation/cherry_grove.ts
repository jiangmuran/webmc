// Cherry grove (1.20). Pink-blossom trees with a wide crown; pink petal
// carpet scattered on grass; pink and white pollen particles. Bees
// gravitate here. Closed-canopy cherry trees are ~7 blocks tall with a
// 7×7 canopy footprint.

export interface CherryTreeLayout {
  trunkHeight: number;
  canopyRadius: number;
  hasBeehive: boolean;
  petalCarpetCount: number;
}

export interface CherryGroveQuery {
  rng: () => number;
}

export function planCherryTree(q: CherryGroveQuery): CherryTreeLayout {
  const trunkHeight = 5 + Math.floor(q.rng() * 4); // 5..8
  const canopyRadius = 3 + Math.floor(q.rng() * 2); // 3..4
  const hasBeehive = q.rng() < 0.05;
  return {
    trunkHeight,
    canopyRadius,
    hasBeehive,
    petalCarpetCount: 4 + Math.floor(q.rng() * 5),
  };
}

// Pink petals 1..4 per carpet tile. Breaking drops all the petals.
export interface PinkPetalCarpet {
  count: 1 | 2 | 3 | 4;
}

export function makePetalCarpet(count: 1 | 2 | 3 | 4 = 1): PinkPetalCarpet {
  return { count };
}

export function addPetal(carpet: PinkPetalCarpet): boolean {
  if (carpet.count >= 4) return false;
  carpet.count = (carpet.count + 1) as 1 | 2 | 3 | 4;
  return true;
}

export function breakPetalCarpet(carpet: PinkPetalCarpet): {
  item: 'webmc:pink_petals';
  count: number;
} {
  return { item: 'webmc:pink_petals', count: carpet.count };
}

// Bone-meal on a grown cherry leaves → sometimes drops a cherry sapling.
export function boneMealLeavesDrop(roll: number): 'webmc:cherry_sapling' | null {
  return roll < 0.05 ? 'webmc:cherry_sapling' : null;
}
