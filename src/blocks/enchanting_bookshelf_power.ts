// Enchanting table bookshelf power. Up to 15 surrounding bookshelves
// (2-block distance, with 1-block air between). Each one raises max
// enchantment level.

export interface Placement {
  dx: number; // relative to table
  dy: number;
  dz: number;
  hasAir: boolean; // whether the intervening cell is non-solid
}

export const MAX_BOOKSHELVES = 15;

export function countEffectiveBookshelves(shelves: Placement[]): number {
  const valid = shelves.filter((s) => isInRange(s) && s.hasAir);
  return Math.min(MAX_BOOKSHELVES, valid.length);
}

// Wiki (minecraft.wiki/w/Enchanting_table#Bookshelves): bookshelves
// only count when they sit on the 5×5 perimeter (max(|dx|,|dz|) === 2)
// on the table's level or one above. The inner 3×3 must be empty for
// the line-of-sight to clear; bookshelves placed there are NOT
// counted. Old check `|dx|≤2 && |dz|≤2` happily counted shelves
// crammed into the inner ring (e.g. directly adjacent to the table)
// — those are physically impossible-with-air placements but the
// `hasAir` guard let through any caller that still flagged them.
function isInRange(p: Placement): boolean {
  return Math.max(Math.abs(p.dx), Math.abs(p.dz)) === 2 && (p.dy === 0 || p.dy === 1);
}

export function maxEnchantmentLevel(count: number): number {
  return Math.max(1, Math.min(30, Math.floor(count * 2)));
}
