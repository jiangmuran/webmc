export interface Placement {
  chunkX: number;
  chunkZ: number;
  seed: number;
}

export const SPAWN_SPACING = 34;
export const SEPARATION = 10;
export const MIN_Y = -40;
export const MAX_Y = -10;

function hash(x: number, z: number, seed: number): number {
  const h = Math.imul(x + seed, 2654435761) ^ Math.imul(z + seed, 1597334677);
  return (h >>> 0) / 0x100000000;
}

export function shouldPlaceStructure(p: Placement): boolean {
  const rx = ((p.chunkX % SPAWN_SPACING) + SPAWN_SPACING) % SPAWN_SPACING;
  const rz = ((p.chunkZ % SPAWN_SPACING) + SPAWN_SPACING) % SPAWN_SPACING;
  if (rx >= SPAWN_SPACING - SEPARATION) return false;
  if (rz >= SPAWN_SPACING - SEPARATION) return false;
  return hash(p.chunkX, p.chunkZ, p.seed) < 0.25;
}

export function pickY(seed: number, cx: number, cz: number): number {
  const f = hash(cx, cz, seed ^ 0xabcdef);
  return MIN_Y + Math.floor(f * (MAX_Y - MIN_Y + 1));
}
