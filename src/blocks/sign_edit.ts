// Sign editing. 4 text lines per face. 1.20+ signs have front + back
// text, waxable to lock (crafted with honeycomb). Each line is limited
// to ~15 glyphs in the default font. Glow_ink_sac toggles outline glow
// per face.

export interface SignFace {
  lines: [string, string, string, string];
  color: string; // dye color (default "black")
  glowing: boolean;
}

export interface SignState {
  front: SignFace;
  back: SignFace;
  waxed: boolean;
}

export function makeSign(): SignState {
  return {
    front: { lines: ['', '', '', ''], color: 'black', glowing: false },
    back: { lines: ['', '', '', ''], color: 'black', glowing: false },
    waxed: false,
  };
}

export type SignSide = 'front' | 'back';

export interface EditQuery {
  side: SignSide;
  lineIndex: 0 | 1 | 2 | 3;
  text: string;
}

export const MAX_LINE_CHARS = 15;

export function editLine(sign: SignState, q: EditQuery): boolean {
  if (sign.waxed) return false;
  const face = sign[q.side];
  const trimmed = q.text.slice(0, MAX_LINE_CHARS);
  face.lines[q.lineIndex] = trimmed;
  return true;
}

export function dyeFace(sign: SignState, side: SignSide, color: string): boolean {
  if (sign.waxed) return false;
  sign[side].color = color;
  return true;
}

export function glowFace(sign: SignState, side: SignSide): boolean {
  if (sign.waxed) return false;
  sign[side].glowing = true;
  return true;
}

// Waxing: applying honeycomb locks all future edits.
export function waxSign(sign: SignState): boolean {
  if (sign.waxed) return false;
  sign.waxed = true;
  return true;
}

// Click on waxed sign with shears removes wax.
export function unwaxSign(sign: SignState): boolean {
  if (!sign.waxed) return false;
  sign.waxed = false;
  return true;
}

// Parse click-command text: clicking a line of the form "/tp ~ ~1 ~"
// runs the command if the sign was signed by an op (tracked elsewhere).
// Here, just detect command intent.
export function isCommandLine(text: string): boolean {
  return text.startsWith('/');
}
