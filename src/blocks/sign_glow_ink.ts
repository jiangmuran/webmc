export interface SignState {
  lines: readonly [string, string, string, string];
  frontGlowing: boolean;
  backGlowing: boolean;
  waxed: boolean;
}

export function applyGlowInk(s: SignState, face: 'front' | 'back'): SignState {
  if (s.waxed) return s;
  return face === 'front' ? { ...s, frontGlowing: true } : { ...s, backGlowing: true };
}

export function applyRegularInk(s: SignState, face: 'front' | 'back'): SignState {
  if (s.waxed) return s;
  return face === 'front' ? { ...s, frontGlowing: false } : { ...s, backGlowing: false };
}

export function effectiveLightLevel(s: SignState, face: 'front' | 'back'): number {
  return (face === 'front' ? s.frontGlowing : s.backGlowing) ? 8 : 0;
}
