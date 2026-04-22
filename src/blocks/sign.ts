// Sign text block entity. 4 text lines + optional per-side text for
// double-sided signs + dye color. Pure — caller wires it to the block
// entity world.

export interface SignState {
  frontLines: [string, string, string, string];
  backLines: [string, string, string, string];
  frontColor: string; // hex or named color
  backColor: string;
  glowing: boolean;
  waxed: boolean; // once waxed, text is locked
}

const MAX_LINE_LEN = 15; // MC sign limit per line.

export function makeSign(): SignState {
  return {
    frontLines: ['', '', '', ''],
    backLines: ['', '', '', ''],
    frontColor: '#000000',
    backColor: '#000000',
    glowing: false,
    waxed: false,
  };
}

export type SignSide = 'front' | 'back';

export function setSignLine(
  state: SignState,
  side: SignSide,
  lineIndex: 0 | 1 | 2 | 3,
  text: string,
): boolean {
  if (state.waxed) return false;
  const clamped = text.slice(0, MAX_LINE_LEN);
  if (side === 'front') state.frontLines[lineIndex] = clamped;
  else state.backLines[lineIndex] = clamped;
  return true;
}

export function waxSign(state: SignState): boolean {
  if (state.waxed) return false;
  state.waxed = true;
  return true;
}

export function toggleGlow(state: SignState): boolean {
  if (state.waxed) return false;
  state.glowing = !state.glowing;
  return true;
}

export function setSignColor(state: SignState, side: SignSide, color: string): boolean {
  if (state.waxed) return false;
  if (side === 'front') state.frontColor = color;
  else state.backColor = color;
  return true;
}
