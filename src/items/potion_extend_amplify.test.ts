import { describe, it, expect } from 'vitest';
import {
  applyRedstone,
  applyGlowstone,
  basePotion,
  EXTENDED_DURATION_TICKS,
} from './potion_extend_amplify';

describe('potion extend amplify', () => {
  it('redstone extends', () => {
    const r = applyRedstone(basePotion());
    expect(r?.durationTicks).toBe(EXTENDED_DURATION_TICKS);
    expect(r?.extended).toBe(true);
  });

  it('glowstone amplifies', () => {
    const r = applyGlowstone(basePotion());
    expect(r?.amplifier).toBe(1);
    expect(r?.amplified).toBe(true);
  });

  it('cannot double-glow after redstone', () => {
    const ext = applyRedstone(basePotion());
    if (!ext) throw new Error('fail');
    expect(applyGlowstone(ext)).toBeNull();
  });

  it('cannot extend after amplify', () => {
    const amp = applyGlowstone(basePotion());
    if (!amp) throw new Error('fail');
    expect(applyRedstone(amp)).toBeNull();
  });
});
