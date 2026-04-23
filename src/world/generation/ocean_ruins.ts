export type RuinVariant = 'warm_small' | 'warm_big' | 'cold_small' | 'cold_big';

export interface OceanRuinsParams {
  isWarm: boolean;
  rng: () => number;
}

export function pickVariant(p: OceanRuinsParams): RuinVariant {
  const big = p.rng() < 0.3;
  if (p.isWarm) return big ? 'warm_big' : 'warm_small';
  return big ? 'cold_big' : 'cold_small';
}

export function hasDrownedSpawner(p: OceanRuinsParams): boolean {
  return p.rng() < 0.5;
}

export function isBuriedInSand(p: OceanRuinsParams): boolean {
  return p.rng() < 0.4;
}
