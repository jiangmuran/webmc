// Dragon egg. Hits-to-break: teleports up to 32 blocks away in a
// random direction instead of breaking. Falls like sand.

export interface DragonEgg {
  x: number;
  y: number;
  z: number;
}

export const TELEPORT_RADIUS_XZ = 15;
export const TELEPORT_RADIUS_Y = 7;

export interface TpQuery {
  rand: () => number;
  isValid: (x: number, y: number, z: number) => boolean;
}

export function onHit(egg: DragonEgg, q: TpQuery): boolean {
  for (let i = 0; i < 16; i++) {
    const dx = Math.floor((q.rand() - 0.5) * 2 * TELEPORT_RADIUS_XZ);
    const dy = Math.floor((q.rand() - 0.5) * 2 * TELEPORT_RADIUS_Y);
    const dz = Math.floor((q.rand() - 0.5) * 2 * TELEPORT_RADIUS_XZ);
    const nx = egg.x + dx;
    const ny = egg.y + dy;
    const nz = egg.z + dz;
    if (q.isValid(nx, ny, nz)) {
      egg.x = nx;
      egg.y = ny;
      egg.z = nz;
      return true;
    }
  }
  return false;
}

// Bedrock/obsidian below prevent egg falling.
export function willFall(blockBelowId: string): boolean {
  if (blockBelowId === 'webmc:air') return true;
  if (blockBelowId === 'webmc:water') return true;
  return false;
}
