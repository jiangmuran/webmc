// Soft/hard mob despawn logic by distance from nearest player.

export const HARD_DESPAWN = 128;
export const SOFT_DESPAWN = 32;
export const SOFT_TIME_TICKS = 600;

export interface MobDespawnCtx {
  distanceToNearestPlayer: number;
  ticksSinceLastPlayerClose: number;
  persistent: boolean;
  rand: () => number;
}

export function shouldDespawn(c: MobDespawnCtx): boolean {
  if (c.persistent) return false;
  if (c.distanceToNearestPlayer > HARD_DESPAWN) return true;
  if (c.distanceToNearestPlayer > SOFT_DESPAWN && c.ticksSinceLastPlayerClose > SOFT_TIME_TICKS) {
    return c.rand() < 1 / 800;
  }
  return false;
}

export function madePersistent(): MobDespawnCtx {
  return {
    distanceToNearestPlayer: 0,
    ticksSinceLastPlayerClose: 0,
    persistent: true,
    rand: Math.random,
  };
}
