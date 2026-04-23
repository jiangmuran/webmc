export const MIN = 5;
export const MAX = 7;
export const TALL_VARIANT_MIN = 10;
export const TALL_VARIANT_MAX = 15;

export function isTallBirchBiome(biome: string): boolean {
  return biome === 'old_growth_birch_forest';
}

export function rollHeight(biome: string, rng: () => number): number {
  if (isTallBirchBiome(biome) && rng() < 0.2) {
    return TALL_VARIANT_MIN + Math.floor(rng() * (TALL_VARIANT_MAX - TALL_VARIANT_MIN + 1));
  }
  return MIN + Math.floor(rng() * (MAX - MIN + 1));
}

export function logType(): string {
  return 'birch_log';
}
