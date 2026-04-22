// Looting enchantment (sword). Adds 0..level extra drops per entity
// kill; rare drops get +1% chance per level.

export const LOOTING_MAX_LEVEL = 3;

export function commonDropBonus(level: number, rand: () => number): number {
  if (level <= 0) return 0;
  return Math.floor(rand() * (level + 1));
}

export function rareDropChance(baseChance: number, level: number): number {
  return baseChance + level * 0.01;
}

// Looting level is only active when killed by player wielding the
// enchanted sword; damage over time / kills by other entities do not.
export interface KillCtx {
  killerHeldEnchantedSword: boolean;
  lootingLevel: number;
}

export function effectiveLevel(k: KillCtx): number {
  return k.killerHeldEnchantedSword ? Math.max(0, Math.min(LOOTING_MAX_LEVEL, k.lootingLevel)) : 0;
}
