// Impaling. +2.5 damage per level to aquatic mobs.

export const IMPALING_MAX = 5;

const AQUATIC = new Set([
  'guardian',
  'elder_guardian',
  'squid',
  'glow_squid',
  'cod',
  'salmon',
  'tropical_fish',
  'pufferfish',
  'dolphin',
  'turtle',
  'axolotl',
  'tadpole',
]);

export function isAquatic(type: string): boolean {
  return AQUATIC.has(type);
}

export function damageBonus(level: number, target: string, inWater: boolean): number {
  if (level <= 0) return 0;
  if (!isAquatic(target) && !inWater) return 0;
  return 2.5 * Math.min(IMPALING_MAX, level);
}
