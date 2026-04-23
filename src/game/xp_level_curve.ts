// XP required to advance from level L to L+1:
//   L<16: 2L+7
//   16≤L<31: 5L-38
//   L≥31: 9L-158

export function xpToNext(level: number): number {
  if (level < 16) return 2 * level + 7;
  if (level < 31) return 5 * level - 38;
  return 9 * level - 158;
}

export function cumulativeXpForLevel(level: number): number {
  let total = 0;
  for (let l = 0; l < level; l++) total += xpToNext(l);
  return total;
}

export function levelFromCumulativeXp(total: number): number {
  let level = 0;
  let acc = 0;
  while (acc + xpToNext(level) <= total) {
    acc += xpToNext(level);
    level++;
  }
  return level;
}

export function progressInLevel(total: number): number {
  const lvl = levelFromCumulativeXp(total);
  const base = cumulativeXpForLevel(lvl);
  const next = xpToNext(lvl);
  return (total - base) / next;
}
