export interface Placement {
  chunkX: number;
  chunkZ: number;
  seed: number;
  biome: string;
}

export const Y_LEVEL = -51;
export const SPACING = 24;
export const SEPARATION = 8;

function hash(x: number, z: number, seed: number): number {
  const h = Math.imul(x + seed, 2654435761) ^ Math.imul(z + seed, 1597334677);
  return (h >>> 0) / 0x100000000;
}

export function canGenerate(p: Placement): boolean {
  if (p.biome !== 'deep_dark') return false;
  const rx = ((p.chunkX % SPACING) + SPACING) % SPACING;
  const rz = ((p.chunkZ % SPACING) + SPACING) % SPACING;
  if (rx >= SPACING - SEPARATION || rz >= SPACING - SEPARATION) return false;
  return hash(p.chunkX, p.chunkZ, p.seed) < 0.4;
}

export function wardenSpawningEnabled(): boolean {
  return true;
}
