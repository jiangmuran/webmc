// Ore vein scatter. Distributes veins across a chunk at specific Y bands.

export type OreKind =
  | 'coal'
  | 'iron'
  | 'copper'
  | 'gold'
  | 'redstone'
  | 'lapis'
  | 'diamond'
  | 'emerald';

export interface OreBand {
  ore: OreKind;
  yMin: number;
  yMax: number;
  veinsPerChunk: number;
  veinSizeMin: number;
  veinSizeMax: number;
}

export const DEFAULT_BANDS: OreBand[] = [
  { ore: 'coal', yMin: 0, yMax: 256, veinsPerChunk: 20, veinSizeMin: 8, veinSizeMax: 18 },
  { ore: 'iron', yMin: -63, yMax: 72, veinsPerChunk: 10, veinSizeMin: 4, veinSizeMax: 10 },
  { ore: 'copper', yMin: -16, yMax: 112, veinsPerChunk: 6, veinSizeMin: 6, veinSizeMax: 14 },
  { ore: 'gold', yMin: -64, yMax: 32, veinsPerChunk: 2, veinSizeMin: 4, veinSizeMax: 9 },
  { ore: 'redstone', yMin: -64, yMax: 16, veinsPerChunk: 8, veinSizeMin: 4, veinSizeMax: 8 },
  { ore: 'lapis', yMin: -64, yMax: 32, veinsPerChunk: 2, veinSizeMin: 3, veinSizeMax: 6 },
  { ore: 'diamond', yMin: -64, yMax: 16, veinsPerChunk: 1, veinSizeMin: 3, veinSizeMax: 8 },
  { ore: 'emerald', yMin: -16, yMax: 256, veinsPerChunk: 1, veinSizeMin: 1, veinSizeMax: 3 }, // mountain biome only
];

export function bandFor(ore: OreKind): OreBand {
  const b = DEFAULT_BANDS.find((x) => x.ore === ore);
  if (!b) throw new Error(`unknown ore ${ore}`);
  return b;
}

export function yInBand(b: OreBand, y: number): boolean {
  return y >= b.yMin && y <= b.yMax;
}

export function veinSizeRoll(b: OreBand, rand: () => number): number {
  return b.veinSizeMin + Math.floor(rand() * (b.veinSizeMax - b.veinSizeMin + 1));
}
