export const MAX_DURABILITY: Record<string, number> = {
  wood: 59,
  gold: 32,
  stone: 131,
  iron: 250,
  diamond: 1561,
  netherite: 2031,
};

export function unbreakingSurvivesChance(level: number): number {
  return Math.max(0, Math.min(1, level / (level + 1)));
}

export function consumeOnHit(
  currentDurability: number,
  unbreaking: number,
  rng: () => number,
): number {
  if (rng() < unbreakingSurvivesChance(unbreaking)) return currentDurability;
  return Math.max(0, currentDurability - 1);
}

export function brokenAt(current: number): boolean {
  return current === 0;
}
