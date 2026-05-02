export interface Trap {
  isTrapped: boolean;
  approachedByPlayer: boolean;
}

// Wiki (minecraft.wiki/w/Skeleton_Horse): "Lightning striking a 'trap'
// skeleton horse spawns 4 skeleton horsemen — a skeleton riding the
// horse plus 3 additional skeleton-mounted skeleton horses." Old
// SKELETON_SPAWN_COUNT=3 was 1 short of the wiki value. Siblings
// skeleton_horse_storm.ts (TRAP_RIDER_COUNT=4) and
// skeleton_horse_trap.ts (TRAP_SKELETONS=4) already use 4.
export const SKELETON_SPAWN_COUNT = 4;

export function spawnsSkeletonsOnApproach(t: Trap): boolean {
  return t.isTrapped && t.approachedByPlayer;
}

export function strikesLightning(t: Trap): boolean {
  return spawnsSkeletonsOnApproach(t);
}

export function skeletonsOnHorsesCount(): number {
  return SKELETON_SPAWN_COUNT;
}
