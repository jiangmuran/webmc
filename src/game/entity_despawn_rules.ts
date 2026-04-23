export interface Mob {
  type: string;
  playerDistance: number;
  ticksSincePlayerNearby: number;
  isPersistent: boolean;
  isNamed: boolean;
  isLeashed: boolean;
}

export const IMMEDIATE_DESPAWN_DISTANCE = 128;
export const RANDOM_DESPAWN_DISTANCE = 32;
export const RANDOM_DESPAWN_AGE = 600;

export function isProtected(m: Mob): boolean {
  return m.isPersistent || m.isNamed || m.isLeashed;
}

export function shouldDespawnImmediately(m: Mob): boolean {
  return !isProtected(m) && m.playerDistance >= IMMEDIATE_DESPAWN_DISTANCE;
}

export function eligibleForRandomDespawn(m: Mob): boolean {
  return (
    !isProtected(m) &&
    m.playerDistance >= RANDOM_DESPAWN_DISTANCE &&
    m.ticksSincePlayerNearby >= RANDOM_DESPAWN_AGE
  );
}
