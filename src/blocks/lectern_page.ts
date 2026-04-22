// Lectern. Holds one written book. Page state (0..N) is shown to
// readers; changing page via right-click advances by 1 and emits a
// redstone pulse. Comparator reads: floor(15 * page/maxPage).

export interface Lectern {
  book: { pageCount: number } | null;
  page: number; // 0..pageCount-1
}

export function makeLectern(): Lectern {
  return { book: null, page: 0 };
}

export function placeBook(l: Lectern, pageCount: number): boolean {
  if (l.book) return false;
  if (pageCount <= 0) return false;
  l.book = { pageCount };
  l.page = 0;
  return true;
}

export function takeBook(l: Lectern): { pageCount: number } | null {
  const b = l.book;
  l.book = null;
  l.page = 0;
  return b;
}

// Right-click advances the page. Left/shift right goes back.
export type NavAction = 'next' | 'prev';

export function nav(l: Lectern, action: NavAction): { changed: boolean; pulsed: boolean } {
  if (!l.book) return { changed: false, pulsed: false };
  const before = l.page;
  if (action === 'next') l.page = Math.min(l.book.pageCount - 1, l.page + 1);
  else l.page = Math.max(0, l.page - 1);
  const changed = l.page !== before;
  return { changed, pulsed: changed };
}

export function comparatorOutput(l: Lectern): number {
  if (!l.book || l.book.pageCount <= 1) return l.book ? 1 : 0;
  return Math.min(15, 1 + Math.floor((l.page / (l.book.pageCount - 1)) * 14));
}
