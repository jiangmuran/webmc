// XP level curve. XP needed to reach the next level increases in tiers:
// 0..16: 2L+7; 17..31: 5L-38; 32+: 9L-158.

export function xpToNextLevel(level: number): number {
  if (level < 16) return 2 * level + 7;
  if (level < 31) return 5 * level - 38;
  return 9 * level - 158;
}

// Total XP points accumulated to reach level L.
export function totalXpForLevel(L: number): number {
  let sum = 0;
  for (let i = 0; i < L; i++) sum += xpToNextLevel(i);
  return sum;
}

export function levelFromTotalXp(total: number): { level: number; remainder: number } {
  let level = 0;
  let remaining = total;
  while (remaining >= xpToNextLevel(level)) {
    remaining -= xpToNextLevel(level);
    level += 1;
    if (level > 1000) break; // safety
  }
  return { level, remainder: remaining };
}

export function xpBarFraction(currentXp: number, level: number): number {
  const need = xpToNextLevel(level);
  if (need <= 0) return 0;
  return Math.min(1, Math.max(0, currentXp / need));
}
