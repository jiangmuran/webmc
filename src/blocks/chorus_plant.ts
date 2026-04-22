// Chorus plant growth. A 5-stage stalk with branching; grown stalks place
// chorus fruit at tip. Pure: given the plant root + lookup, return what
// blocks to place next.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ChorusLookup {
  isEndStoneBelow(x: number, y: number, z: number): boolean;
  isAir(x: number, y: number, z: number): boolean;
  height(x: number, y: number, z: number): number; // stalk height above root
}

const MAX_HEIGHT = 6;
const GROWTH_CHANCE_PER_TICK = 0.2;

export interface GrowResult {
  placements: readonly { pos: Vec3; block: 'webmc:chorus_plant' | 'webmc:chorus_flower' }[];
}

export function tickChorusPlant(
  tip: Vec3,
  lookup: ChorusLookup,
  rng: () => number = Math.random,
): GrowResult {
  const placements: GrowResult['placements'][number][] = [];
  const currentHeight = lookup.height(tip.x, tip.y, tip.z);
  if (currentHeight >= MAX_HEIGHT) {
    // Tip finalises into a chorus flower.
    placements.push({ pos: tip, block: 'webmc:chorus_flower' });
    return { placements };
  }
  if (rng() >= GROWTH_CHANCE_PER_TICK) return { placements };
  // Grow upward by default.
  const upPos = { x: tip.x, y: tip.y + 1, z: tip.z };
  if (!lookup.isAir(upPos.x, upPos.y, upPos.z)) return { placements };
  placements.push({ pos: upPos, block: 'webmc:chorus_plant' });
  // Occasionally branch on horizontal.
  if (rng() < 0.3) {
    const offsets: readonly (readonly [number, number])[] = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const pick = offsets[Math.floor(rng() * offsets.length)] ?? [0, 0];
    const dx = pick[0];
    const dz = pick[1];
    const branch = { x: upPos.x + dx, y: upPos.y, z: upPos.z + dz };
    if (lookup.isAir(branch.x, branch.y, branch.z)) {
      placements.push({ pos: branch, block: 'webmc:chorus_plant' });
    }
  }
  return { placements };
}
