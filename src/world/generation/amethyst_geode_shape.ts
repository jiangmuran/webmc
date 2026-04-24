export interface GeodeBudConfig {
  chanceSmall: number;
  chanceMedium: number;
  chanceLarge: number;
  chanceCluster: number;
}

export const DEFAULT_BUD_CHANCE: GeodeBudConfig = {
  chanceSmall: 0.083,
  chanceMedium: 0.083,
  chanceLarge: 0.083,
  chanceCluster: 0.5,
};

export interface GeodeLayerRadii {
  outer: number;
  middle: number;
  innerStart: number;
  innerEnd: number;
}

export const DEFAULT_RADII: GeodeLayerRadii = {
  outer: 9,
  middle: 7,
  innerStart: 5,
  innerEnd: 6,
};

export function blockAt(radius: number, r: GeodeLayerRadii): string {
  if (radius <= r.innerStart) return 'air';
  if (radius <= r.innerEnd) return 'amethyst_block';
  if (radius <= r.middle) return 'smooth_basalt';
  if (radius <= r.outer) return 'calcite';
  return 'netherrack';
}

export function eastNorthCrackPresent(rng: () => number): boolean {
  return rng() < 0.95;
}
