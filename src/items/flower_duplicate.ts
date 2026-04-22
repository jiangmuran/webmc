// Bone meal on a flower duplicates it (MC 1.13+) — placing a new flower
// within an 8×1×8 area (same flower kind) around the original. Tall
// flowers (sunflower, lilac) grow, they don't duplicate.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const TALL_FLOWERS = new Set([
  'webmc:sunflower',
  'webmc:lilac',
  'webmc:rose_bush',
  'webmc:peony',
  'webmc:tall_grass',
  'webmc:large_fern',
]);

export function canDuplicateFlower(flowerName: string): boolean {
  return !TALL_FLOWERS.has(flowerName);
}

export interface FlowerLookup {
  isReplaceable(x: number, y: number, z: number): boolean;
  hasGrassBelow(x: number, y: number, z: number): boolean;
}

export function boneMealFlower(
  origin: Vec3,
  flowerName: string,
  lookup: FlowerLookup,
  rng: () => number = Math.random,
): readonly { pos: Vec3; block: string }[] {
  if (!canDuplicateFlower(flowerName)) return [];
  const placements: { pos: Vec3; block: string }[] = [];
  for (let attempt = 0; attempt < 16 && placements.length < 4; attempt++) {
    const dx = Math.floor((rng() - 0.5) * 8);
    const dz = Math.floor((rng() - 0.5) * 8);
    const p = { x: origin.x + dx, y: origin.y, z: origin.z + dz };
    if (!lookup.isReplaceable(p.x, p.y, p.z)) continue;
    if (!lookup.hasGrassBelow(p.x, p.y - 1, p.z)) continue;
    placements.push({ pos: p, block: flowerName });
  }
  return placements;
}
