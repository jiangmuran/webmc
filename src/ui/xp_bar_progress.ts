export function xpForLevel(level: number): number {
  if (level < 16) return 2 * level + 7;
  if (level < 31) return 5 * level - 38;
  return 9 * level - 158;
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 0; i < level; i++) total += xpForLevel(i);
  return total;
}

export function progressFraction(currentLevelXp: number, level: number): number {
  const needed = xpForLevel(level);
  if (needed <= 0) return 0;
  return Math.max(0, Math.min(1, currentLevelXp / needed));
}

export function greenTintLevelAtLeast(level: number): boolean {
  return level >= 30;
}
