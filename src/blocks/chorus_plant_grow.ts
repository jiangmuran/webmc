// Chorus plant growth. Each tick, live flower may grow upward up to 5
// blocks tall, with occasional branches. Growth ends when flower is
// obstructed, cools on the flower.

export interface ChorusGrowQuery {
  heightBelow: number; // stacked stem count below this flower
  neighborsHorizontal: number;
  rand: () => number;
}

export const MAX_HEIGHT = 5;
export const BRANCH_CHANCE = 0.5;

export type GrowResult =
  | { kind: 'grow_up' }
  | { kind: 'branch'; directions: number } // 1..3
  | { kind: 'stop' };

export function chorusGrow(q: ChorusGrowQuery): GrowResult {
  if (q.heightBelow >= MAX_HEIGHT) return { kind: 'stop' };
  if (q.neighborsHorizontal >= 2) return { kind: 'stop' };
  if (q.rand() < BRANCH_CHANCE) {
    const dirs = 1 + Math.floor(q.rand() * 3);
    return { kind: 'branch', directions: dirs };
  }
  return { kind: 'grow_up' };
}

// Chorus fruit eating: teleport to random location within ±8 blocks
// on each axis (a 17×17×17 cube). Wiki (minecraft.wiki/w/Chorus_Fruit):
// "up to 16 attempts are made to choose a random destination within
// ±8 on all three axes in the same manner as enderman teleportation."
export interface TeleportQuery {
  from: { x: number; y: number; z: number };
  rand: () => number;
  validLanding: (x: number, y: number, z: number) => boolean;
}

export const CHORUS_TP_RADIUS = 8;

// Old `floor((rand-0.5)*2*8)` gave [-8, +7] (16 distinct values) —
// floor of an asymmetric pre-shifted range silently dropped +8.
// Wiki canon is the symmetric 17-value range [-8..+8] inclusive.
function offsetInclusive(rand: () => number): number {
  return Math.floor(rand() * (2 * CHORUS_TP_RADIUS + 1)) - CHORUS_TP_RADIUS;
}

export function chorusTeleport(q: TeleportQuery): { x: number; y: number; z: number } | null {
  for (let i = 0; i < 16; i++) {
    const dx = offsetInclusive(q.rand);
    const dy = offsetInclusive(q.rand);
    const dz = offsetInclusive(q.rand);
    const x = q.from.x + dx;
    const y = q.from.y + dy;
    const z = q.from.z + dz;
    if (q.validLanding(x, y, z)) return { x, y, z };
  }
  return null;
}
