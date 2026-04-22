import { describe, it, expect } from 'vitest';
import { pickSplash, SPLASH_ROTATION_DEG, splashScalePulse } from './splash_screen';

describe('splash screen', () => {
  it('pick returns an entry', () => {
    const s = pickSplash({ nowMonthDay: '06-15', rng: () => 0.5 });
    expect(s.text.length).toBeGreaterThan(0);
  });

  it('christmas date = christmas splash', () => {
    // High-weighted christmas entry dominates the pool on 12-25.
    let foundChristmas = false;
    for (let i = 0; i < 10; i++) {
      const s = pickSplash({ nowMonthDay: '12-25', rng: () => i / 10 });
      if (s.text.toLowerCase().includes('christmas')) foundChristmas = true;
    }
    expect(foundChristmas).toBe(true);
  });

  it('scale pulses around 1', () => {
    const s0 = splashScalePulse(0);
    const s1 = splashScalePulse(0.125);
    expect(s0).toBeCloseTo(1);
    expect(s1).toBeCloseTo(1.08);
  });

  it('rotation is -20°', () => {
    expect(SPLASH_ROTATION_DEG).toBe(-20);
  });
});
