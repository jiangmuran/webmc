// Deepslate vs stone ore distribution. Ores generate as both variants
// depending on Y: below y=0 they're deepslate, above they're stone.
// A transition band at y=0..16 mixes the two.

export type OreKind =
  | 'coal'
  | 'iron'
  | 'copper'
  | 'gold'
  | 'redstone'
  | 'lapis'
  | 'diamond'
  | 'emerald';

export interface OreVariantQuery {
  kind: OreKind;
  y: number;
  rng: () => number;
}

const TRANSITION_LOW = 0;
const TRANSITION_HIGH = 16;

export function oreVariant(q: OreVariantQuery): 'stone' | 'deepslate' {
  if (q.y <= TRANSITION_LOW) return 'deepslate';
  if (q.y >= TRANSITION_HIGH) return 'stone';
  const t = (q.y - TRANSITION_LOW) / (TRANSITION_HIGH - TRANSITION_LOW);
  return q.rng() < t ? 'stone' : 'deepslate';
}

export function oreBlockId(kind: OreKind, variant: 'stone' | 'deepslate'): string {
  const prefix = variant === 'deepslate' ? 'deepslate_' : '';
  return `webmc:${prefix}${kind}_ore`;
}

// Per-ore distribution ranges (Y range + density factor).
export interface OreDistribution {
  kind: OreKind;
  minY: number;
  maxY: number;
  peakY: number; // triangle-distribution center (where density is highest)
  veinsPerChunk: number;
  veinSize: number;
}

export const ORE_DISTRIBUTIONS: readonly OreDistribution[] = [
  { kind: 'coal', minY: 0, maxY: 320, peakY: 96, veinsPerChunk: 30, veinSize: 17 },
  { kind: 'iron', minY: -64, maxY: 320, peakY: 16, veinsPerChunk: 20, veinSize: 9 },
  { kind: 'copper', minY: -16, maxY: 112, peakY: 48, veinsPerChunk: 16, veinSize: 10 },
  { kind: 'gold', minY: -64, maxY: 32, peakY: -16, veinsPerChunk: 4, veinSize: 9 },
  { kind: 'redstone', minY: -64, maxY: 15, peakY: -58, veinsPerChunk: 8, veinSize: 8 },
  { kind: 'lapis', minY: -64, maxY: 64, peakY: 0, veinsPerChunk: 2, veinSize: 7 },
  { kind: 'diamond', minY: -64, maxY: 16, peakY: -58, veinsPerChunk: 7, veinSize: 8 },
  { kind: 'emerald', minY: -16, maxY: 320, peakY: 224, veinsPerChunk: 1, veinSize: 3 },
];

// Triangle distribution density at a given Y.
export function densityAt(d: OreDistribution, y: number): number {
  if (y < d.minY || y > d.maxY) return 0;
  const distFromPeak = Math.abs(y - d.peakY);
  const maxDist = Math.max(d.peakY - d.minY, d.maxY - d.peakY);
  if (maxDist === 0) return 1;
  return Math.max(0, 1 - distFromPeak / maxDist);
}
