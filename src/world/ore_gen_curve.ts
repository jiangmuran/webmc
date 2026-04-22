// Ore distribution curves. MC uses triangular-ish distributions at
// specific Y-ranges. We expose pure sample-probability functions.

export type OreKind =
  | 'coal'
  | 'copper'
  | 'iron'
  | 'gold'
  | 'redstone'
  | 'lapis'
  | 'diamond'
  | 'emerald';

export interface OreProfile {
  minY: number;
  maxY: number;
  peakY: number; // mode of triangular distribution
  baseProb: number; // probability at peak, per-block
}

const PROFILES: Record<OreKind, OreProfile> = {
  coal: { minY: 0, maxY: 320, peakY: 96, baseProb: 0.015 },
  copper: { minY: -16, maxY: 112, peakY: 48, baseProb: 0.016 },
  iron: { minY: -64, maxY: 256, peakY: 16, baseProb: 0.02 },
  gold: { minY: -64, maxY: 32, peakY: -16, baseProb: 0.005 },
  redstone: { minY: -64, maxY: 15, peakY: -58, baseProb: 0.018 },
  lapis: { minY: -64, maxY: 64, peakY: 0, baseProb: 0.004 },
  diamond: { minY: -64, maxY: 16, peakY: -58, baseProb: 0.003 },
  emerald: { minY: -16, maxY: 256, peakY: 224, baseProb: 0.0015 },
};

export function profileFor(ore: OreKind): OreProfile {
  return PROFILES[ore];
}

export function probabilityAt(ore: OreKind, y: number): number {
  const p = PROFILES[ore];
  if (y < p.minY || y > p.maxY) return 0;
  const leftWidth = p.peakY - p.minY;
  const rightWidth = p.maxY - p.peakY;
  if (y <= p.peakY) {
    if (leftWidth <= 0) return p.baseProb;
    return (p.baseProb * (y - p.minY)) / leftWidth;
  }
  if (rightWidth <= 0) return p.baseProb;
  return (p.baseProb * (p.maxY - y)) / rightWidth;
}
