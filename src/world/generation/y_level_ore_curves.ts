export type Ore =
  | 'coal'
  | 'iron'
  | 'copper'
  | 'gold'
  | 'redstone'
  | 'lapis'
  | 'diamond'
  | 'emerald';

export interface OreCurve {
  minY: number;
  maxY: number;
  peakY: number;
  peakDensity: number;
}

// Wiki (minecraft.wiki/w/Ore#Distribution): canonical 1.18+ peaks.
//   Diamond: peak Y=-58 (old: -60, off by 2)
//   Emerald: peak Y=232 (old: 200, off by 32 — players above 232
//            but below 256 saw too few emeralds)
// Other ores were already at the wiki values; this aligns the
// final two outliers.
const CURVES: Record<Ore, OreCurve> = {
  coal: { minY: 0, maxY: 256, peakY: 96, peakDensity: 0.02 },
  iron: { minY: -64, maxY: 256, peakY: 16, peakDensity: 0.02 },
  copper: { minY: -16, maxY: 112, peakY: 48, peakDensity: 0.01 },
  gold: { minY: -64, maxY: 32, peakY: -16, peakDensity: 0.01 },
  redstone: { minY: -64, maxY: 16, peakY: -58, peakDensity: 0.02 },
  lapis: { minY: -64, maxY: 64, peakY: 0, peakDensity: 0.005 },
  diamond: { minY: -64, maxY: 16, peakY: -58, peakDensity: 0.004 },
  emerald: { minY: -16, maxY: 320, peakY: 232, peakDensity: 0.0005 },
};

export function densityAtY(ore: Ore, y: number): number {
  const c = CURVES[ore];
  if (y < c.minY || y > c.maxY) return 0;
  const span = Math.max(Math.abs(c.peakY - c.minY), Math.abs(c.maxY - c.peakY));
  const dist = Math.abs(y - c.peakY);
  return Math.max(0, c.peakDensity * (1 - dist / span));
}

export function bestOreAt(y: number): Ore | undefined {
  let best: { ore: Ore; d: number } | undefined;
  for (const k of Object.keys(CURVES) as Ore[]) {
    const d = densityAtY(k, y);
    if (d > 0 && (best === undefined || d > best.d)) best = { ore: k, d };
  }
  return best?.ore;
}
