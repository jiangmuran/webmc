// Enchantment table level/roll mechanics. Three "slots" offer a potential
// enchant at level 1-30, modulated by bookshelves around the table.
// Each bookshelf (up to 15) in the 5×5×2 ring adds 1 to the max level.

export interface BookshelfQuery {
  shelfCount: number; // 0..15
  rng: () => number;
  slot: 0 | 1 | 2;
}

export function baseLevel(q: BookshelfQuery): number {
  const shelves = Math.min(15, Math.max(0, q.shelfCount));
  const j = Math.floor(q.rng() * 8) + 1 + (shelves >> 1) + Math.floor(q.rng() * (shelves + 1));
  let level;
  if (q.slot === 0) level = Math.max(j / 3, 1);
  else if (q.slot === 1) level = (j * 2) / 3 + 1;
  else level = Math.max(j, shelves * 2);
  return Math.floor(level);
}

// Actual enchant "power" (final rolled level) adds +/-15% jitter.
export function enchantPower(baseLvl: number, rng: () => number): number {
  const jitter = 0.85 + rng() * 0.3;
  const modified = baseLvl * jitter;
  return Math.round(modified);
}

// Each cast consumes 1 level (+ 1 lapis) for slot 0, 2 for slot 1, 3 for
// slot 2 (the showcase label is "cost 1/2/3", but the displayed level
// requirement may be higher).
export const SLOT_LEVEL_COST: readonly [number, number, number] = [1, 2, 3];

export function canAfford(playerXpLevel: number, slot: 0 | 1 | 2, displayedLevel: number): boolean {
  return playerXpLevel >= SLOT_LEVEL_COST[slot] && playerXpLevel >= displayedLevel;
}
