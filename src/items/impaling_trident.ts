// Impaling. +2.5 damage per level to aquatic mobs (Java Edition).
//
// Wiki (minecraft.wiki/w/Impaling): "In Java Edition, only aquatic
// mobs receive the extra damage … but NOT drowned, as drowned are
// classified purely as undead mobs and not underwater mobs."
// Earlier change wrongly added 'drowned' to the list citing the
// 'aquatic_mobs' tag, but the wiki page (and JIRA bug MC-128249,
// resolved Working-As-Intended) explicitly excludes drowned.

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

export function damageBonus(level: number, target: string, _inWater: boolean): number {
  if (level <= 0) return 0;
  if (!isAquatic(target)) return 0;
  return 2.5 * Math.min(IMPALING_MAX, level);
}
