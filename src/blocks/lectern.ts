// Lectern. Holds a single book; outputs a redstone signal equal to the
// currently-open page (1..15). Right-click to read, book cycles pages.

export interface LecternState {
  book: { title: string; author: string; pages: string[] } | null;
  currentPage: number; // 0-indexed
}

export function makeLectern(): LecternState {
  return { book: null, currentPage: 0 };
}

export function insertBook(
  state: LecternState,
  book: { title: string; author: string; pages: string[] },
): boolean {
  if (state.book) return false;
  if (book.pages.length === 0) return false;
  state.book = { ...book, pages: [...book.pages] };
  state.currentPage = 0;
  return true;
}

export function ejectBook(state: LecternState): LecternState['book'] {
  const b = state.book;
  state.book = null;
  state.currentPage = 0;
  return b;
}

export function nextPage(state: LecternState): boolean {
  if (!state.book) return false;
  if (state.currentPage >= state.book.pages.length - 1) return false;
  state.currentPage++;
  return true;
}

export function prevPage(state: LecternState): boolean {
  if (!state.book) return false;
  if (state.currentPage <= 0) return false;
  state.currentPage--;
  return true;
}

// MC comparator formula: (currentPage / (totalPages - 1)) × 15, rounded,
// clamped to 0..15; empty lectern = 0.
export function comparatorSignal(state: LecternState): number {
  if (!state.book) return 0;
  const total = state.book.pages.length;
  if (total <= 1) return 15;
  return Math.min(15, Math.floor(((state.currentPage + 1) / total) * 15));
}
