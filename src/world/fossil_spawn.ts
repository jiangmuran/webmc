// Fossils spawn underground in deserts/swamps/mangrove; variants of
// skeletal spines + coal ore veins.

export type FossilBiome = 'desert' | 'swamp' | 'mangrove_swamp';

export function canSpawnIn(biome: string): biome is FossilBiome {
  return biome === 'desert' || biome === 'swamp' || biome === 'mangrove_swamp';
}

// Wiki (minecraft.wiki/w/Fossil): "Each chunk has two attempts within
// Y-coordinates 0 to 320 or -63 to -8 underground to generate a
// fossil, each with a chance of 1/64."
//
// Two distinct ranges:
//   ABOVE: Y 0 to 320 (above-surface fossils, e.g. exposed in cliffs)
//   UNDERGROUND: Y -63 to -8 (the common cave-region fossils with
//                              diamond ore in their bones)
//
// Old constants -24 to 0 covered neither wiki range — fossils
// generated in a narrow band that wasn't underground enough for
// diamond ore (wiki: < -8) and not high enough for the surface set.
export const FOSSIL_Y_MIN = -63;
export const FOSSIL_Y_MAX = 320;
export const FOSSIL_UNDERGROUND_MAX = -8;
export const FOSSIL_ABOVE_MIN = 0;

export function yInRange(y: number): boolean {
  // Wiki: Y in [0, 320] OR Y in [-63, -8].
  if (y >= FOSSIL_ABOVE_MIN && y <= FOSSIL_Y_MAX) return true;
  if (y >= FOSSIL_Y_MIN && y <= FOSSIL_UNDERGROUND_MAX) return true;
  return false;
}

export const FOSSIL_VARIANT_COUNT = 14;

export function variantIdFor(seed: number, chunkX: number, chunkZ: number): number {
  let h = seed >>> 0;
  h = (Math.imul(h ^ chunkX, 2654435761) ^ chunkZ) >>> 0;
  return h % FOSSIL_VARIANT_COUNT;
}
