// Lectern book state. A lectern can hold one book (written/knowledge/
// writable). Right-click opens a public reading view; while reading,
// the lectern emits a comparator signal equal to (currentPage / totalPages)
// × 15 + 1.

export interface LecternState {
  heldBook: { id: string; totalPages: number } | null;
  currentPage: number; // 0-based
  readers: Set<string>; // player ids currently reading
}

export function makeLectern(): LecternState {
  return { heldBook: null, currentPage: 0, readers: new Set() };
}

export interface PlaceBookQuery {
  bookItem: string;
  totalPages: number;
}

export function placeBook(state: LecternState, q: PlaceBookQuery): boolean {
  if (state.heldBook !== null) return false;
  if (q.totalPages < 1) return false;
  state.heldBook = { id: q.bookItem, totalPages: q.totalPages };
  state.currentPage = 0;
  return true;
}

export function takeBook(state: LecternState): string | null {
  if (!state.heldBook) return null;
  const id = state.heldBook.id;
  state.heldBook = null;
  state.currentPage = 0;
  state.readers.clear();
  return id;
}

export function openBook(state: LecternState, playerId: string): boolean {
  if (!state.heldBook) return false;
  state.readers.add(playerId);
  return true;
}

export function closeBook(state: LecternState, playerId: string): boolean {
  return state.readers.delete(playerId);
}

export function turnPage(state: LecternState, delta: number): boolean {
  if (!state.heldBook) return false;
  const next = Math.max(0, Math.min(state.heldBook.totalPages - 1, state.currentPage + delta));
  if (next === state.currentPage) return false;
  state.currentPage = next;
  return true;
}

// Comparator output: 0 when no book, else 1..15.
export function comparatorSignal(state: LecternState): number {
  if (!state.heldBook) return 0;
  const frac = state.currentPage / Math.max(1, state.heldBook.totalPages - 1);
  return Math.floor(frac * 14) + 1;
}

// Page-turn via redstone pulse: advances the page by one, wrapping.
export function pulseAdvance(state: LecternState): boolean {
  if (!state.heldBook) return false;
  state.currentPage = (state.currentPage + 1) % state.heldBook.totalPages;
  return true;
}
