// Wither rose: applies Wither effect on contact to mobs that step on it.
// Spawns where a wither kills a mob. Iron golems, undead, wither are immune.

export const WITHER_ROSE_DAMAGE_TICKS = 40;
export const WITHER_ROSE_DAMAGE_AMPLIFIER = 0;

// Wiki: wither effect is immune to all undead + iron_golem + wither.
// Was 5 entries — missed husk, stray, drowned, zombie_villager,
// zombified_piglin, bogged (1.21).
const IMMUNE_MOBS = new Set([
  'wither',
  'iron_golem',
  // Undead family — all immune to wither effect per wiki.
  'zombie',
  'zombie_villager',
  'husk',
  'drowned',
  'skeleton',
  'wither_skeleton',
  'stray',
  'bogged',
  'zombified_piglin',
  'phantom',
]);

export function appliesWitherTo(mobType: string): boolean {
  return !IMMUNE_MOBS.has(mobType);
}

export function spawnsFromMobKilledByWither(mobType: string): boolean {
  return mobType !== 'wither' && mobType !== 'ender_dragon';
}

export function requiresGrassyBlock(): boolean {
  return true;
}
