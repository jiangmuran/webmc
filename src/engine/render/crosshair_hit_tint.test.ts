import { describe, it, expect } from 'vitest';
import { crosshairColor, ringProgressAlpha } from './crosshair_hit_tint';

describe('crosshair hit tint', () => {
  it('hostile mob red tint', () => {
    const [r, g, b] = crosshairColor({
      targetEntity: { hostile: true, targetable: true },
      targetBlockBreakable: false,
      cooldownFraction: 1,
    });
    expect(r).toBeGreaterThan(g);
    expect(r).toBeGreaterThan(b);
  });

  it('passive green tint', () => {
    const [r, g] = crosshairColor({
      targetEntity: { hostile: false, targetable: true },
      targetBlockBreakable: false,
      cooldownFraction: 1,
    });
    expect(g).toBeGreaterThan(r);
  });

  it('block white', () => {
    const [r, g, b] = crosshairColor({
      targetBlockBreakable: true,
      cooldownFraction: 1,
    });
    expect(r === g && g === b).toBe(true);
  });

  it('air dim gray', () => {
    const [r] = crosshairColor({ targetBlockBreakable: false, cooldownFraction: 1 });
    expect(r).toBeLessThan(1);
  });

  it('ring alpha bounded', () => {
    expect(ringProgressAlpha(0)).toBe(0);
    expect(ringProgressAlpha(1)).toBe(1);
    expect(ringProgressAlpha(5)).toBe(1);
  });
});
