export interface ImpaleHit {
  target: string;
  impalingLevel: number;
}

export const BASE_BONUS_PER_LEVEL = 2.5;

// Wiki (minecraft.wiki/w/Impaling): "In Java Edition, only aquatic
// mobs receive the extra damage … but NOT drowned, as drowned are
// classified purely as undead mobs and not underwater mobs (JIRA
// MC-128249 closed Working-As-Intended)." Players are also excluded
// in JE — the old `target === 'player'` branch was the Bedrock rule.
// Sibling impaling_trident.ts has the same aquatic list.
export function bonusDamage(h: ImpaleHit): number {
  if (h.impalingLevel <= 0) return 0;
  if (isAquatic(h.target)) {
    return h.impalingLevel * BASE_BONUS_PER_LEVEL;
  }
  return 0;
}

export function isAquatic(mob: string): boolean {
  return [
    'squid',
    'glow_squid',
    'guardian',
    'elder_guardian',
    'cod',
    'salmon',
    'dolphin',
    'turtle',
    'tropical_fish',
    'pufferfish',
    'axolotl',
    'tadpole',
  ].includes(mob);
}
