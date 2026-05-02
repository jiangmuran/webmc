// Lectern: comparator reads current page as 1..15 scaled from book pages.

export interface LecternState {
  bookPresent: boolean;
  pageIndex: number;
  pageCount: number;
}

// Wiki (minecraft.wiki/w/Lectern): "The comparator output is
// determined by the current page of the book: from 1 (first page)
// to 15 (last page), in equal steps." Formula:
//   output = 1 + floor(pageIndex / (pageCount - 1) * 14)
//
// Old formula used `* 15` instead of `* 14`, then clamped the
// resulting 16 down to 15 only on the LAST page. Intermediate pages
// were off-by-one (e.g. with 4 pages, page 1 returned 6 instead of
// the wiki's 5; page 2 returned 11 instead of 10).
export function comparatorSignal(s: LecternState): number {
  if (!s.bookPresent || s.pageCount <= 0) return 0;
  if (s.pageCount === 1) return 1;
  return 1 + Math.floor((s.pageIndex / (s.pageCount - 1)) * 14);
}

export function turnPage(s: LecternState, forward: boolean): LecternState {
  if (!s.bookPresent) return s;
  const next = forward ? s.pageIndex + 1 : s.pageIndex - 1;
  return { ...s, pageIndex: Math.max(0, Math.min(s.pageCount - 1, next)) };
}

export function ejectBook(s: LecternState): LecternState {
  return { ...s, bookPresent: false, pageIndex: 0, pageCount: 0 };
}

export function placeBook(s: LecternState, pageCount: number): LecternState {
  return { ...s, bookPresent: true, pageIndex: 0, pageCount };
}
