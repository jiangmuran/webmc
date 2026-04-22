// Sign dye + glow ink selection. Maps player action to sign front/back.

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

export interface SignFace {
  color: DyeColor;
  glowing: boolean;
}

export interface SignBlock {
  front: SignFace;
  back: SignFace;
  waxed: boolean;
}

export function makeSign(): SignBlock {
  return {
    front: { color: 'black', glowing: false },
    back: { color: 'black', glowing: false },
    waxed: false,
  };
}

// Dye applied to the clicked side.
export function applyDye(s: SignBlock, side: 'front' | 'back', c: DyeColor): boolean {
  if (s.waxed) return false;
  s[side].color = c;
  return true;
}

export function applyGlowInk(s: SignBlock, side: 'front' | 'back'): boolean {
  if (s.waxed) return false;
  s[side].glowing = true;
  return true;
}

export function removeGlow(s: SignBlock, side: 'front' | 'back'): boolean {
  if (s.waxed) return false;
  s[side].glowing = false;
  return true;
}

export function wax(s: SignBlock): void {
  s.waxed = true;
}
