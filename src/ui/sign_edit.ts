export const MAX_LINES = 4;
export const MAX_CHARS_PER_LINE = 15;

export interface Sign {
  lines: [string, string, string, string];
}

export function setLine(s: Sign, idx: number, text: string): Sign {
  if (idx < 0 || idx >= MAX_LINES) return s;
  const clipped = text.slice(0, MAX_CHARS_PER_LINE);
  const lines = [...s.lines] as [string, string, string, string];
  lines[idx] = clipped;
  return { lines };
}

export function isEmpty(s: Sign): boolean {
  return s.lines.every((l) => l === '');
}
