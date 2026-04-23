export interface Trap {
  isTrapped: boolean;
  approachedByPlayer: boolean;
}

export const SKELETON_SPAWN_COUNT = 3;

export function spawnsSkeletonsOnApproach(t: Trap): boolean {
  return t.isTrapped && t.approachedByPlayer;
}

export function strikesLightning(t: Trap): boolean {
  return spawnsSkeletonsOnApproach(t);
}

export function skeletonsOnHorsesCount(): number {
  return SKELETON_SPAWN_COUNT;
}
