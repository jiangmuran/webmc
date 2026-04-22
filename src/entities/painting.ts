// Painting entity. Placed on a vertical wall, comes in 28 variants
// (1×1 .. 4×4). Randomly picked when placed unless a specific variant
// is chosen via data.

export interface PaintingVariant {
  key: string;
  width: number; // in blocks
  height: number;
}

export const PAINTING_VARIANTS: readonly PaintingVariant[] = [
  { key: 'alban', width: 1, height: 1 },
  { key: 'aztec', width: 1, height: 1 },
  { key: 'aztec2', width: 1, height: 1 },
  { key: 'bomb', width: 1, height: 1 },
  { key: 'kebab', width: 1, height: 1 },
  { key: 'plant', width: 1, height: 1 },
  { key: 'wasteland', width: 1, height: 1 },
  { key: 'courbet', width: 2, height: 1 },
  { key: 'creebet', width: 2, height: 1 },
  { key: 'pool', width: 2, height: 1 },
  { key: 'sea', width: 2, height: 1 },
  { key: 'sunset', width: 2, height: 1 },
  { key: 'graham', width: 1, height: 2 },
  { key: 'wanderer', width: 1, height: 2 },
  { key: 'bust', width: 2, height: 2 },
  { key: 'match', width: 2, height: 2 },
  { key: 'skull_and_roses', width: 2, height: 2 },
  { key: 'stage', width: 2, height: 2 },
  { key: 'void', width: 2, height: 2 },
  { key: 'wither', width: 2, height: 2 },
  { key: 'fighters', width: 4, height: 2 },
  { key: 'donkey_kong', width: 4, height: 3 },
  { key: 'skeleton', width: 4, height: 3 },
  { key: 'pointer', width: 4, height: 4 },
  { key: 'pigscene', width: 4, height: 4 },
  { key: 'burning_skull', width: 4, height: 4 },
  { key: 'earth', width: 2, height: 2 },
  { key: 'sun', width: 2, height: 2 },
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
