// Unbreaking. Each damage tick has a chance to be skipped.
//
// Wiki (minecraft.wiki/w/Unbreaking):
//   Tools: 'a 100%/(level+1) chance that using the item reduces
//     durability, … 50%/66.66%/75% chance of not using any
//     durability' — skip = 1 − 1/(L+1).
//   Armor: 'a 60%+40%/(level+1) chance a use reduces durability,
//     meaning each durability hit … has a 20%/26.66%/30% chance
//     of being ignored.'
//
// Old armorSkipChance returned `0.6 + 0.4/(L+1)` — the TAKE-damage
// chance, not the skip chance. The caller treated it as skip
// chance, inverting the effect: armor at Unbreaking I skipped
// damage 80% of the time (vs wiki 20%) and Unbreaking III skipped
// 70% (vs wiki 30%) — armor lasted ~4× longer than wiki said.

export const UNBREAKING_MAX = 3;

export function toolSkipChance(level: number): number {
  if (level <= 0) return 0;
  return 1 - 1 / (level + 1);
}

// Skip = 1 − (0.6 + 0.4/(L+1)) = 0.4 × L/(L+1)
// → 0.20 / 0.267 / 0.30 at L=1/2/3 (matches wiki).
export function armorSkipChance(level: number): number {
  if (level <= 0) return 0;
  return (0.4 * level) / (level + 1);
}

export function rollConsumesDurability(
  level: number,
  rand: () => number,
  isArmor: boolean,
): boolean {
  const skipChance = isArmor ? armorSkipChance(level) : toolSkipChance(level);
  return rand() >= skipChance;
}
