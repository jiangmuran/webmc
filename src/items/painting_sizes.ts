// Painting canvases. Wiki (minecraft.wiki/w/Painting): "There are 47
// paintings in the game." (1.21+ — adds 1.21 paintings: backyard, pond,
// bouquet, cavebird, cotan, endboss, fern, owlemons, sunflowers, tides,
// dennis, baroque, humble, meditative, prairie_ride, changing, finding,
// lowmist, passage, orb, unpacked.) Java Edition randomly picks the
// largest fitting canvas; this list is the rollable set. The 4 elemental
// paintings (earth/wind/fire/water) are command-only per wiki and are
// intentionally excluded so randomSizeFitting cannot select them.
//
// Old set had only 10 — wiki canon is 47. With ~5x the canvases now
// rollable, large frames (3×3, 3×4, 4×2, 4×4) are no longer dominated by
// a single choice.

export interface PaintingSize {
  id: string;
  w: number;
  h: number;
}

export const SIZES: PaintingSize[] = [
  // 1×1
  { id: 'kebab', w: 1, h: 1 },
  { id: 'aztec', w: 1, h: 1 },
  { id: 'alban', w: 1, h: 1 },
  { id: 'aztec2', w: 1, h: 1 },
  { id: 'bomb', w: 1, h: 1 },
  { id: 'plant', w: 1, h: 1 },
  { id: 'wasteland', w: 1, h: 1 },
  { id: 'meditative', w: 1, h: 1 },
  // 1×2 (tall)
  { id: 'wanderer', w: 1, h: 2 },
  { id: 'graham', w: 1, h: 2 },
  { id: 'prairie_ride', w: 1, h: 2 },
  // 2×1 (wide)
  { id: 'pool', w: 2, h: 1 },
  { id: 'courbet', w: 2, h: 1 },
  { id: 'sunset', w: 2, h: 1 },
  { id: 'sea', w: 2, h: 1 },
  { id: 'creebet', w: 2, h: 1 },
  // 2×2
  { id: 'match', w: 2, h: 2 },
  { id: 'bust', w: 2, h: 2 },
  { id: 'stage', w: 2, h: 2 },
  { id: 'void', w: 2, h: 2 },
  { id: 'skull_and_roses', w: 2, h: 2 },
  { id: 'wither', w: 2, h: 2 },
  { id: 'baroque', w: 2, h: 2 },
  { id: 'humble', w: 2, h: 2 },
  // 3×3
  { id: 'bouquet', w: 3, h: 3 },
  { id: 'cavebird', w: 3, h: 3 },
  { id: 'cotan', w: 3, h: 3 },
  { id: 'endboss', w: 3, h: 3 },
  { id: 'fern', w: 3, h: 3 },
  { id: 'owlemons', w: 3, h: 3 },
  { id: 'sunflowers', w: 3, h: 3 },
  { id: 'tides', w: 3, h: 3 },
  { id: 'dennis', w: 3, h: 3 },
  // 3×4 (tall)
  { id: 'backyard', w: 3, h: 4 },
  { id: 'pond', w: 3, h: 4 },
  // 4×2 (wide)
  { id: 'fighters', w: 4, h: 2 },
  { id: 'changing', w: 4, h: 2 },
  { id: 'finding', w: 4, h: 2 },
  { id: 'lowmist', w: 4, h: 2 },
  { id: 'passage', w: 4, h: 2 },
  // 4×3 (wide)
  { id: 'skeleton', w: 4, h: 3 },
  { id: 'donkey_kong', w: 4, h: 3 },
  // 4×4
  { id: 'pointer', w: 4, h: 4 },
  { id: 'pigscene', w: 4, h: 4 },
  { id: 'burning_skull', w: 4, h: 4 },
  { id: 'orb', w: 4, h: 4 },
  { id: 'unpacked', w: 4, h: 4 },
];

export function fitsInSpace(size: PaintingSize, availW: number, availH: number): boolean {
  return size.w <= availW && size.h <= availH;
}

export function randomSizeFitting(
  availW: number,
  availH: number,
  rng: () => number,
): PaintingSize | undefined {
  const options = SIZES.filter((s) => fitsInSpace(s, availW, availH));
  if (options.length === 0) return undefined;
  return options[Math.floor(rng() * options.length)];
}
