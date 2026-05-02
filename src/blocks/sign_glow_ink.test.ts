import { describe, it, expect } from 'vitest';
import {
  applyGlowInk,
  applyRegularInk,
  effectiveLightLevel,
  type SignState,
} from './sign_glow_ink';

const base: SignState = {
  lines: ['', '', '', ''],
  frontGlowing: false,
  backGlowing: false,
  waxed: false,
};

describe('sign glow ink', () => {
  it('glow front', () => {
    expect(applyGlowInk(base, 'front').frontGlowing).toBe(true);
  });

  it('waxed immutable', () => {
    const waxed: SignState = { ...base, waxed: true };
    expect(applyGlowInk(waxed, 'front').frontGlowing).toBe(false);
  });

  it('regular ink removes glow', () => {
    const glowing: SignState = { ...base, frontGlowing: true };
    expect(applyRegularInk(glowing, 'front').frontGlowing).toBe(false);
  });

  it('glow ink does NOT emit light from block (wiki)', () => {
    // Wiki: glow ink only makes text more visible in darkness;
    // the sign itself emits no light.
    expect(effectiveLightLevel({ ...base, frontGlowing: true }, 'front')).toBe(0);
    expect(effectiveLightLevel({ ...base, backGlowing: true }, 'back')).toBe(0);
    expect(effectiveLightLevel(base, 'back')).toBe(0);
  });
});
