export interface LecternState {
  hasBook: boolean;
  page: number;
  totalPages: number;
}

export function comparatorSignal(s: LecternState): number {
  if (!s.hasBook || s.totalPages <= 0) return 0;
  if (s.totalPages === 1) return 15;
  return Math.min(15, Math.floor(1 + ((s.page - 1) * 14) / (s.totalPages - 1)));
}

export function isActive(s: LecternState): boolean {
  return s.hasBook;
}

export function nextPage(s: LecternState): LecternState {
  if (!s.hasBook) return s;
  return { ...s, page: Math.min(s.totalPages, s.page + 1) };
}
