// Painting entity. Wiki (minecraft.wiki/w/Painting): "There are 47
// paintings in the game." (1.21+ — adds 21 paintings: backyard,
// pond, bouquet, cavebird, cotan, endboss, fern, owlemons,
// sunflowers, tides, dennis, baroque, humble, meditative,
// prairie_ride, changing, finding, lowmist, passage, orb,
// unpacked.) Java Edition randomly picks the largest fitting
// canvas; this list is the rollable set. The 4 elemental
// paintings (earth/wind/fire/water) are command-only per wiki and
// are intentionally excluded so pickPainting cannot select them.
//
// Old set had 28 entries: 26 canonical pre-1.21 paintings + the
// command-only 'earth' (wrongly rollable) + a non-existent 'sun'
// motif. Sibling items/painting_sizes.ts already has the 47-entry
// canonical list; harmonised.

export interface PaintingVariant {
  key: string;
  width: number; // in blocks
  height: number;
}

export const PAINTING_VARIANTS: readonly PaintingVariant[] = [
  // 1×1
  { key: 'kebab', width: 1, height: 1 },
  { key: 'aztec', width: 1, height: 1 },
  { key: 'alban', width: 1, height: 1 },
  { key: 'aztec2', width: 1, height: 1 },
  { key: 'bomb', width: 1, height: 1 },
  { key: 'plant', width: 1, height: 1 },
  { key: 'wasteland', width: 1, height: 1 },
  { key: 'meditative', width: 1, height: 1 },
  // 1×2 (tall)
  { key: 'wanderer', width: 1, height: 2 },
  { key: 'graham', width: 1, height: 2 },
  { key: 'prairie_ride', width: 1, height: 2 },
  // 2×1 (wide)
  { key: 'pool', width: 2, height: 1 },
  { key: 'courbet', width: 2, height: 1 },
  { key: 'sunset', width: 2, height: 1 },
  { key: 'sea', width: 2, height: 1 },
  { key: 'creebet', width: 2, height: 1 },
  // 2×2
  { key: 'match', width: 2, height: 2 },
  { key: 'bust', width: 2, height: 2 },
  { key: 'stage', width: 2, height: 2 },
  { key: 'void', width: 2, height: 2 },
  { key: 'skull_and_roses', width: 2, height: 2 },
  { key: 'wither', width: 2, height: 2 },
  { key: 'baroque', width: 2, height: 2 },
  { key: 'humble', width: 2, height: 2 },
  // 3×3
  { key: 'bouquet', width: 3, height: 3 },
  { key: 'cavebird', width: 3, height: 3 },
  { key: 'cotan', width: 3, height: 3 },
  { key: 'endboss', width: 3, height: 3 },
  { key: 'fern', width: 3, height: 3 },
  { key: 'owlemons', width: 3, height: 3 },
  { key: 'sunflowers', width: 3, height: 3 },
  { key: 'tides', width: 3, height: 3 },
  { key: 'dennis', width: 3, height: 3 },
  // 3×4 (tall)
  { key: 'backyard', width: 3, height: 4 },
  { key: 'pond', width: 3, height: 4 },
  // 4×2 (wide)
  { key: 'fighters', width: 4, height: 2 },
  { key: 'changing', width: 4, height: 2 },
  { key: 'finding', width: 4, height: 2 },
  { key: 'lowmist', width: 4, height: 2 },
  { key: 'passage', width: 4, height: 2 },
  // 4×3 (wide)
  { key: 'skeleton', width: 4, height: 3 },
  { key: 'donkey_kong', width: 4, height: 3 },
  // 4×4
  { key: 'pointer', width: 4, height: 4 },
  { key: 'pigscene', width: 4, height: 4 },
  { key: 'burning_skull', width: 4, height: 4 },
  { key: 'orb', width: 4, height: 4 },
  { key: 'unpacked', width: 4, height: 4 },
];

export interface PlacementQuery {
  widthAvailable: number;
  heightAvailable: number;
  rng: () => number;
}

export function pickPainting(q: PlacementQuery): PaintingVariant | null {
  const fits = PAINTING_VARIANTS.filter(
    (v) => v.width <= q.widthAvailable && v.height <= q.heightAvailable,
  );
  if (fits.length === 0) return null;
  const idx = Math.floor(q.rng() * fits.length);
  return fits[idx] ?? fits[0] ?? null;
}
