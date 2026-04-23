// Stronghold library room. Chiseled bookshelves + loot chest with
// enchanted book pool.

export const LIBRARY_BOOKSHELF_COUNT_RANGE = { min: 36, max: 60 };
export const LIBRARY_LOOT_POOL = [
  'enchanted_book_sharpness',
  'enchanted_book_efficiency',
  'enchanted_book_unbreaking',
  'enchanted_book_protection',
  'enchanted_book_looting',
  'enchanted_book_silk_touch',
  'enchanted_book_fortune',
];

export function rollBookshelfCount(rand: () => number): number {
  const r = LIBRARY_BOOKSHELF_COUNT_RANGE;
  return r.min + Math.floor(rand() * (r.max - r.min + 1));
}

export function rollEnchantedBook(rand: () => number): string {
  const idx = Math.floor(rand() * LIBRARY_LOOT_POOL.length);
  return LIBRARY_LOOT_POOL[idx] ?? 'enchanted_book_sharpness';
}

export function hasTwoFloors(rand: () => number): boolean {
  return rand() < 0.5;
}
