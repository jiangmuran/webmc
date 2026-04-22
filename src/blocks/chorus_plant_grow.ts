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

// Chorus fruit eating: teleport to random location in a 16x16x16 around.
export interface TeleportQuery {
  from: { x: number; y: number; z: number };
  rand: () => number;
  validLanding: (x: number, y: number, z: number) => boolean;
}

export const CHORUS_TP_RADIUS = 8;

export function chorusTeleport(q: TeleportQuery): { x: number; y: number; z: number } | null {
  for (let i = 0; i < 16; i++) {
    const dx = Math.floor((q.rand() - 0.5) * 2 * CHORUS_TP_RADIUS);
    const dy = Math.floor((q.rand() - 0.5) * 2 * CHORUS_TP_RADIUS);
    const dz = Math.floor((q.rand() - 0.5) * 2 * CHORUS_TP_RADIUS);
    const x = q.from.x + dx;
    const y = q.from.y + dy;
    const z = q.from.z + dz;
    if (q.validLanding(x, y, z)) return { x, y, z };
  }
  return null;
}
