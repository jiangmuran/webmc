export interface ImpaleHit {
  target: string;
  impalingLevel: number;
}

export const BASE_BONUS_PER_LEVEL = 2.5;

// Wiki (minecraft.wiki/w/Impaling): "In Java Edition, Impaling deals
// extra damage to aquatic mobs only — it does not affect players (a
// Bedrock-only behavior)." Old `target === 'player'` branch was the
// Bedrock rule; webmc targets Java Edition, so trident PvP must NOT
// receive the +2.5/level boost. Aquatic list also gained drowned,
// glow_squid, and pufferfish (per the same page's affected-mobs list).
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
    'drowned',
    'turtle',
    'tropical_fish',
    'pufferfish',
    'axolotl',
    'tadpole',
  ].includes(mob);
}
