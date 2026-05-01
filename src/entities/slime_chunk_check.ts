// Slime chunks. A ~10% of chunks at y < 40 permit slime spawning
// regardless of light; the chunk ID is derived from seed + coords.

const HASH_MOD = 10;

export function isSlimeChunk(seed: number, chunkX: number, chunkZ: number): boolean {
  let h = seed >>> 0;
  h = (Math.imul(h ^ chunkX, 2654435761) ^ chunkZ) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 1597334677) >>> 0;
  return h % HASH_MOD === 0;
}

// Wiki (minecraft.wiki/w/Slime#Swamps): "[Slimes] spawn most often on
// a full moon, and never on a new moon. If the fraction of the moon
// that is bright is greater than a random number (from 0 to 1), [the
// spawn check passes]." So the check is `rand() < moonFullness`,
// not a fixed `moonFullness >= 0.5` threshold.
//
// Old code returned true iff moonFullness >= 0.5, which:
//   - waxing/waning crescent (canon 0.25): always REJECTED in code,
//     but per wiki should pass ~25% of attempts.
//   - waxing/waning gibbous (canon 0.75): always ACCEPTED in code,
//     but per wiki should pass only ~75% of attempts.
// This made swamp slime spawning bimodal (full/new) instead of the
// canonical 8-step ramp.
// Wiki (minecraft.wiki/w/Slime#Swamps): swamp slime spawn altitude
// is Y=51..Y=69 inclusive, not 50..70. Tightened to match.
export const SWAMP_SLIME_MIN_Y = 51;
export const SWAMP_SLIME_MAX_Y = 69;

export function canSpawnSlimeHere(
  seed: number,
  chunkX: number,
  chunkZ: number,
  y: number,
  biome: string,
  isNight: boolean,
  moonFullness: number,
  rand: () => number = Math.random,
): boolean {
  if (biome === 'swamp' && y >= SWAMP_SLIME_MIN_Y && y <= SWAMP_SLIME_MAX_Y && isNight) {
    return rand() < moonFullness;
  }
  if (y < 40 && isSlimeChunk(seed, chunkX, chunkZ)) return true;
  return false;
}

export const SLIME_UNDERGROUND_MAX_Y = 40;
