// Wither rose: applies Wither effect on contact to mobs that step on it.
// Spawns where a wither kills a mob. Iron golems, undead, wither are immune.

export const WITHER_ROSE_DAMAGE_TICKS = 40;
export const WITHER_ROSE_DAMAGE_AMPLIFIER = 0;

const IMMUNE_MOBS = new Set(['wither', 'wither_skeleton', 'skeleton', 'zombie', 'iron_golem']);

export function appliesWitherTo(mobType: string): boolean {
  return !IMMUNE_MOBS.has(mobType);
}

export function spawnsFromMobKilledByWither(mobType: string): boolean {
  return mobType !== 'wither' && mobType !== 'ender_dragon';
}

export function requiresGrassyBlock(): boolean {
  return true;
}
