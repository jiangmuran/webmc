// Wiki (minecraft.wiki/w/Dragon_Egg): "trying to [mine the dragon
// egg] causes it to teleport within a 31×15×31 volume centered on
// the egg... if it fails to find an air block after 1,000 attempts
// at teleporting, it can be mined."
//
// 31 along x/z = ±15 inclusive (31 values per axis); 15 along y =
// ±7 inclusive. Two old bugs:
//
// (1) `floor((rand-0.5) * 2 * R)` gave the asymmetric range [-R,
//     R-1] — floor of a pre-shifted negative range silently drops
//     the +R endpoint, so the egg could never teleport to the
//     positive-X/Z extreme.
// (2) 16 attempts vs wiki's 1000 — the egg gave up far too early,
//     letting players mine it just by surrounding it with two
//     valid spots and a few invalid spots. Sibling
//     dragon_egg_teleport.ts already uses 1000 attempts.

export interface DragonEgg {
  x: number;
  y: number;
  z: number;
}

export const TELEPORT_RADIUS_XZ = 15;
export const TELEPORT_RADIUS_Y = 7;
export const MAX_TELEPORT_ATTEMPTS = 1000;

export interface TpQuery {
  rand: () => number;
  isValid: (x: number, y: number, z: number) => boolean;
}

function offset(radius: number, rand: () => number): number {
  return Math.floor(rand() * (2 * radius + 1)) - radius;
}

export function onHit(egg: DragonEgg, q: TpQuery): boolean {
  for (let i = 0; i < MAX_TELEPORT_ATTEMPTS; i++) {
    const dx = offset(TELEPORT_RADIUS_XZ, q.rand);
    const dy = offset(TELEPORT_RADIUS_Y, q.rand);
    const dz = offset(TELEPORT_RADIUS_XZ, q.rand);
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
