// Lectern book ejection. Right-click a lectern with a book inserts;
// right-click an inserted book ejects. Left-click or sneak-interact
// removes the book directly.

export interface Lectern {
  book: { pageCount: number; title: string } | null;
  currentPage: number;
  lastPowerPulseTick: number;
}

export function makeLectern(): Lectern {
  return { book: null, currentPage: 0, lastPowerPulseTick: -Infinity };
}

export function insertBook(l: Lectern, book: { pageCount: number; title: string }): boolean {
  if (l.book !== null) return false;
  if (book.pageCount <= 0) return false;
  l.book = book;
  l.currentPage = 0;
  return true;
}

export function removeBook(l: Lectern): { pageCount: number; title: string } | null {
  const b = l.book;
  l.book = null;
  l.currentPage = 0;
  return b;
}

export function turnPage(l: Lectern, delta: number, nowTick: number): boolean {
  if (!l.book) return false;
  const next = Math.max(0, Math.min(l.book.pageCount - 1, l.currentPage + delta));
  if (next === l.currentPage) return false;
  l.currentPage = next;
  l.lastPowerPulseTick = nowTick;
  return true;
}

// Redstone output signal from comparator: 1..15 based on page number.
// Wiki (minecraft.wiki/w/Lectern): a 1-page book outputs 15 (the
// only page IS the last page). Old code returned 1, conflicting with
// sibling lectern_book_signal.
export function comparatorOutput(l: Lectern): number {
  if (!l.book) return 0;
  if (l.book.pageCount === 1) return 15;
  return Math.min(15, 1 + Math.floor((l.currentPage / (l.book.pageCount - 1)) * 14));
}
