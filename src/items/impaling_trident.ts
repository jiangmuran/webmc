// Impaling. +2.5 damage per level to aquatic mobs (Java Edition).
//
// Wiki (minecraft.wiki/w/Impaling): "In Java Edition, Impaling deals
// extra damage to aquatic mobs only — it does not affect players or
// other entities, even when they are in water." The old `inWater`
// branch implemented the Bedrock rule, which gave +12.5 hp to a
// zombie that happened to wade into a lake. webmc targets Java
// Edition; sibling arrow_impale_target.ts has the same fix. Also
// added 'drowned' to the aquatic list per the Java source's
// aquatic_mobs tag.

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
  'drowned',
  'turtle',
  'axolotl',
  'tadpole',
]);

export function isAquatic(type: string): boolean {
  return AQUATIC.has(type);
}

export function damageBonus(level: number, target: string, _inWater: boolean): number {
  if (level <= 0) return 0;
  if (!isAquatic(target)) return 0;
  return 2.5 * Math.min(IMPALING_MAX, level);
}
