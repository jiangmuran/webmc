// Heavy core. Component of mace crafting (breeze rod + heavy core).
// Falls with gravity and damages entities on impact (like anvil).

export const HEAVY_CORE_FALL_DAMAGE_PER_BLOCK = 2;
export const HEAVY_CORE_MAX_FALL_DAMAGE = 40;

export function fallDamage(blocksFallen: number): number {
  const raw = Math.max(0, blocksFallen - 1) * HEAVY_CORE_FALL_DAMAGE_PER_BLOCK;
  return Math.min(HEAVY_CORE_MAX_FALL_DAMAGE, raw);
}

export interface MaceRecipe {
  breezeRod: boolean;
  heavyCore: boolean;
}

export function canCraftMace(r: MaceRecipe): boolean {
  return r.breezeRod && r.heavyCore;
}

export function affectedByGravity(): boolean {
  return true;
}
