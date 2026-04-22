// Sign text. Signs hold 4 lines per side, both front and back can be
// edited, and can be dye-colored with glowing variant.

export type DyeColor =
  | 'white'
  | 'orange'
  | 'magenta'
  | 'light_blue'
  | 'yellow'
  | 'lime'
  | 'pink'
  | 'gray'
  | 'light_gray'
  | 'cyan'
  | 'purple'
  | 'blue'
  | 'brown'
  | 'green'
  | 'red'
  | 'black';

export interface SignSide {
  lines: [string, string, string, string];
  color: DyeColor;
  glowing: boolean;
}

export interface Sign {
  front: SignSide;
  back: SignSide;
  waxed: boolean;
}

export const MAX_CHARS_PER_LINE = 15;

export function makeSign(): Sign {
  return {
    front: { lines: ['', '', '', ''], color: 'black', glowing: false },
    back: { lines: ['', '', '', ''], color: 'black', glowing: false },
    waxed: false,
  };
}

function truncate(s: string): string {
  return s.length <= MAX_CHARS_PER_LINE ? s : s.slice(0, MAX_CHARS_PER_LINE);
}

export interface EditQuery {
  side: 'front' | 'back';
  line: 0 | 1 | 2 | 3;
  text: string;
}

export function edit(s: Sign, q: EditQuery): boolean {
  if (s.waxed) return false;
  const side = s.front; // placeholder — replaced below
  const target = q.side === 'front' ? s.front : s.back;
  void side;
  target.lines[q.line] = truncate(q.text);
  return true;
}

export function dye(s: Sign, side: 'front' | 'back', color: DyeColor): boolean {
  if (s.waxed) return false;
  s[side].color = color;
  return true;
}

export function applyGlowInk(s: Sign, side: 'front' | 'back'): boolean {
  if (s.waxed) return false;
  s[side].glowing = true;
  return true;
}

export function wax(s: Sign): void {
  s.waxed = true;
}
