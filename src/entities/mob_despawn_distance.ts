export interface DespawnInput {
  distanceToNearestPlayer: number;
  ageTicks: number;
  isPersistent: boolean;
  hasCustomName: boolean;
}

export const INSTANT_DESPAWN_DISTANCE = 128;
export const SOFT_DESPAWN_DISTANCE = 32;
export const MIN_AGE_TO_DESPAWN = 20 * 30;

export function forcedToDespawn(i: DespawnInput): boolean {
  if (i.isPersistent || i.hasCustomName) return false;
  return i.distanceToNearestPlayer >= INSTANT_DESPAWN_DISTANCE;
}

export function chanceOfSoftDespawn(i: DespawnInput): number {
  if (i.isPersistent || i.hasCustomName) return 0;
  if (i.ageTicks < MIN_AGE_TO_DESPAWN) return 0;
  if (i.distanceToNearestPlayer <= SOFT_DESPAWN_DISTANCE) return 0;
  return 1 / 800;
}
