// Iron golems spawn in villages when multiple villagers "gossip" about
// unreleased raid warnings or recently-attacked neighbors.

export interface VillageCtx {
  villagerCount: number;
  bedsClaimed: number;
  workstationsClaimed: number;
  recentAttackTicks: number;
}

export function canSpawnGolem(c: VillageCtx): boolean {
  if (c.villagerCount < 3) return false;
  if (c.bedsClaimed < 2) return false;
  if (c.workstationsClaimed < 2) return false;
  return true;
}

export function spawnPriorityBoost(c: VillageCtx): number {
  return c.recentAttackTicks > 0 ? 2 : 1;
}

export function spawnCapForVillageSize(villagerCount: number): number {
  return Math.floor(villagerCount / 10) + 1;
}
