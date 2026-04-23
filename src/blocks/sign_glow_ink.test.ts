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

  it('glowing face lights 8', () => {
    expect(effectiveLightLevel({ ...base, frontGlowing: true }, 'front')).toBe(8);
  });

  it('non-glow 0', () => {
    expect(effectiveLightLevel(base, 'back')).toBe(0);
  });
});
