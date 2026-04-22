// Phantom membrane. Drops 0-1 from killed phantoms (+looting bonus).
// Used to repair elytra in an anvil + brew Slow Falling potion.

export interface PhantomDropQuery {
  lootingLevel: number;
  rng: () => number;
}

export function rollMembraneDrop(q: PhantomDropQuery): number {
  const base = q.rng() < 0.5 ? 1 : 0;
  const bonus = q.lootingLevel > 0 && q.rng() < q.lootingLevel * 0.2 ? 1 : 0;
  return base + bonus;
}

// Repairing elytra: each membrane restores 108 durability (432 max).
export const ELYTRA_REPAIR_PER_MEMBRANE = 108;
export const ELYTRA_MAX_DURABILITY = 432;

export interface ElytraRepairQuery {
  currentDamage: number;
  membraneCount: number;
}

export interface ElytraRepairResult {
  membranesConsumed: number;
  newDamage: number;
  xpLevelCost: number;
}

export function repairElytra(q: ElytraRepairQuery): ElytraRepairResult {
  const needed = Math.ceil(q.currentDamage / ELYTRA_REPAIR_PER_MEMBRANE);
  const use = Math.min(needed, q.membraneCount);
  return {
    membranesConsumed: use,
    newDamage: Math.max(0, q.currentDamage - use * ELYTRA_REPAIR_PER_MEMBRANE),
    xpLevelCost: use * 2,
  };
}
