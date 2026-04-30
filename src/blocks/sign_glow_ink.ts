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

// Wiki (minecraft.wiki/w/Glow_Ink_Sac): "The text does not emit
// any light, it is only more visible in darkness, similarly to the
// eyes of spiders and endermen." Old code returned light 8 for
// glowing signs — wrong, glow ink sacs make the *text* visible
// in darkness but the block itself stays dark. Returns 0 now;
// renderer reads the glowing flag separately for the text overlay.
export function effectiveLightLevel(_s: SignState, _face: 'front' | 'back'): number {
  return 0;
}
