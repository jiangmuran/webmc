// Fossils spawn underground in deserts/swamps/mangrove; variants of
// skeletal spines + coal ore veins.

export type FossilBiome = 'desert' | 'swamp' | 'mangrove_swamp';

export function canSpawnIn(biome: string): biome is FossilBiome {
  return biome === 'desert' || biome === 'swamp' || biome === 'mangrove_swamp';
}

export const FOSSIL_Y_MIN = -24;
export const FOSSIL_Y_MAX = 0;

export function yInRange(y: number): boolean {
  return y >= FOSSIL_Y_MIN && y <= FOSSIL_Y_MAX;
}

export const FOSSIL_VARIANT_COUNT = 14;

export function variantIdFor(seed: number, chunkX: number, chunkZ: number): number {
  let h = seed >>> 0;
  h = (Math.imul(h ^ chunkX, 2654435761) ^ chunkZ) >>> 0;
  return h % FOSSIL_VARIANT_COUNT;
}
