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

function isInRange(p: Placement): boolean {
  return Math.abs(p.dx) <= 2 && Math.abs(p.dz) <= 2 && (p.dy === 0 || p.dy === 1);
}

export function maxEnchantmentLevel(count: number): number {
  return Math.max(1, Math.min(30, Math.floor(count * 2)));
}
