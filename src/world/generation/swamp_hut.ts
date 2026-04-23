export interface Placement {
  chunkX: number;
  chunkZ: number;
  seed: number;
  biome: string;
}

export const SPAWN_CHANCE = 0.05;
export const CAT_SPAWN = true;
export const WITCH_SPAWN = true;

export function canGenerate(p: Placement): boolean {
  if (p.biome !== 'swamp') return false;
  const h =
    (Math.imul(p.chunkX + p.seed, 2654435761) ^ Math.imul(p.chunkZ + p.seed, 1597334677)) >>> 0;
  return h / 0x100000000 < SPAWN_CHANCE;
}

export function containsMobs(): { witch: boolean; cat: boolean } {
  return { witch: WITCH_SPAWN, cat: CAT_SPAWN };
}
