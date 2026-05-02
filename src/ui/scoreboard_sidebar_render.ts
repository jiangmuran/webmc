export interface ScoreLine {
  name: string;
  score: number;
}

export const MAX_SIDEBAR_ENTRIES = 15;

// Reused sort scratch — was `[...all]` per call, allocating a fresh
// array every frame the scoreboard is visible (the caller reads the
// result synchronously and doesn't keep the reference).
const DISPLAYED_SORT_SCRATCH: ScoreLine[] = [];

function compareScoreDesc(a: ScoreLine, b: ScoreLine): number {
  return b.score - a.score;
}

export function displayedEntries(all: readonly ScoreLine[]): readonly ScoreLine[] {
  const out = DISPLAYED_SORT_SCRATCH;
  out.length = 0;
  // Cap at MAX_SIDEBAR_ENTRIES via a top-K-style copy: still O(N) but
  // bounded by N (no separate slice() alloc afterward). For huge
  // entry lists with short cap this also lets the sort run on a
  // shorter array.
  for (let i = 0; i < all.length; i++) out.push(all[i]!);
  out.sort(compareScoreDesc);
  if (out.length > MAX_SIDEBAR_ENTRIES) out.length = MAX_SIDEBAR_ENTRIES;
  return out;
}

export function formatLine(line: ScoreLine, maxNameWidth: number, maxScoreWidth: number): string {
  const padded = line.name.padEnd(maxNameWidth);
  const score = String(line.score).padStart(maxScoreWidth);
  return `${padded} ${score}`;
}

export function widestName(entries: readonly ScoreLine[]): number {
  let m = 0;
  for (let i = 0; i < entries.length; i++) {
    const len = entries[i]!.name.length;
    if (len > m) m = len;
  }
  return m;
}
