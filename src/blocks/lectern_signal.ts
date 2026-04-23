// Lectern: comparator reads current page as 1..15 scaled from book pages.

export interface LecternState {
  bookPresent: boolean;
  pageIndex: number;
  pageCount: number;
}

export function comparatorSignal(s: LecternState): number {
  if (!s.bookPresent || s.pageCount <= 0) return 0;
  return Math.min(15, Math.floor((s.pageIndex / Math.max(1, s.pageCount - 1)) * 15) + 1);
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
