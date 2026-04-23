export const BOOKSHELF_BREAK_DROPS_BOOKS = 3;

export function breakDrops(silkTouch: boolean): { item: string; count: number }[] {
  if (silkTouch) return [{ item: 'bookshelf', count: 1 }];
  return [{ item: 'book', count: BOOKSHELF_BREAK_DROPS_BOOKS }];
}

export function enchantPowerBoost(): number {
  return 1;
}
