// Text rendering width calculation. MC font is variable-width;
// approximate by per-codepoint widths. Used for truncating + wrapping.

const DEFAULT_WIDTH = 6;

const SPECIAL_WIDTHS: Record<string, number> = {
  i: 2,
  l: 3,
  ':': 2,
  '.': 2,
  "'": 2,
  '!': 2,
  '|': 2,
  ',': 2,
  ';': 2,
  '`': 3,
};

export function charWidth(ch: string): number {
  return SPECIAL_WIDTHS[ch] ?? DEFAULT_WIDTH;
}

export function stringWidth(s: string): number {
  let total = 0;
  for (const c of s) total += charWidth(c);
  return total;
}

// Wrap to maxWidth.
export function wrapText(s: string, maxWidth: number): string[] {
  if (maxWidth <= 0) return [s];
  const out: string[] = [];
  const words = s.split(' ');
  let line = '';
  for (const w of words) {
    const candidate = line ? line + ' ' + w : w;
    if (stringWidth(candidate) > maxWidth) {
      if (line) out.push(line);
      line = w;
    } else {
      line = candidate;
    }
  }
  if (line) out.push(line);
  return out;
}

// Truncate with ellipsis if too wide.
export function truncate(s: string, maxWidth: number): string {
  if (stringWidth(s) <= maxWidth) return s;
  let out = '';
  for (const ch of s) {
    if (stringWidth(out + ch + '…') > maxWidth) break;
    out += ch;
  }
  return out + '…';
}
