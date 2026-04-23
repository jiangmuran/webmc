export interface History {
  entries: string[];
  cursor: number;
  max: number;
}

export function create(max = 50): History {
  return { entries: [], cursor: -1, max };
}

export function push(h: History, entry: string): History {
  if (entry === '') return h;
  const entries = [...h.entries, entry].slice(-h.max);
  return { ...h, entries, cursor: entries.length };
}

export function prev(h: History): { text: string | undefined; state: History } {
  if (h.entries.length === 0) return { text: undefined, state: h };
  const idx = Math.max(0, h.cursor - 1);
  return { text: h.entries[idx], state: { ...h, cursor: idx } };
}

export function next(h: History): { text: string | undefined; state: History } {
  const idx = Math.min(h.entries.length, h.cursor + 1);
  const text = idx >= h.entries.length ? '' : h.entries[idx];
  return { text, state: { ...h, cursor: idx } };
}
