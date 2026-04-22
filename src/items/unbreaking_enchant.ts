// Unbreaking. Each damage tick has a chance to be skipped.
// Chance = 1 - 1/(level+1) for tools; armor uses a separate formula.

export const UNBREAKING_MAX = 3;

export function toolSkipChance(level: number): number {
  if (level <= 0) return 0;
  return 1 - 1 / (level + 1);
}

export function armorSkipChance(level: number): number {
  if (level <= 0) return 0;
  return 0.6 + 0.4 / (level + 1);
}

export function rollConsumesDurability(
  level: number,
  rand: () => number,
  isArmor: boolean,
): boolean {
  const skipChance = isArmor ? armorSkipChance(level) : toolSkipChance(level);
  return rand() >= skipChance;
}
