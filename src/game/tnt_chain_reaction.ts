// TNT chain reaction. A detonation propagates to adjacent TNT blocks
// within explosion range, igniting them with a randomised short fuse.

export const ADJACENT_FUSE_MIN = 10;
export const ADJACENT_FUSE_MAX = 30;

export interface ChainCtx {
  detonationPower: number;
  distance: number;
}

export function shouldIgniteNearbyTnt(c: ChainCtx): boolean {
  return c.distance <= c.detonationPower * 2;
}

export function shortFuseTicks(rand: () => number): number {
  return ADJACENT_FUSE_MIN + Math.floor(rand() * (ADJACENT_FUSE_MAX - ADJACENT_FUSE_MIN + 1));
}

export function launchedByBlast(
  distance: number,
  power: number,
): { vx: number; vy: number; vz: number } {
  const push = Math.max(0, 1 - distance / (power * 2));
  return { vx: 0, vy: push * 0.5, vz: 0 };
}
