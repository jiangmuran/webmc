import { describe, it, expect } from 'vitest';
import { clampGamma, displayLight, displayLightWithNightVision } from './gamma_brightness';

describe('gamma', () => {
  it('clamps', () => {
    expect(clampGamma(-1)).toBe(0);
    expect(clampGamma(5)).toBe(1);
    expect(clampGamma(0.5)).toBe(0.5);
    expect(clampGamma(NaN)).toBe(0.5);
  });

  it('monotone in light', () => {
    let prev = -1;
    for (let l = 0; l <= 15; l++) {
      const v = displayLight(l, 0.5);
      expect(v).toBeGreaterThan(prev);
      prev = v;
    }
  });

  it('monotone in gamma', () => {
    expect(displayLight(8, 1)).toBeGreaterThan(displayLight(8, 0));
  });

  it('night vision boosts', () => {
    expect(displayLightWithNightVision(0, 0)).toBeGreaterThanOrEqual(0.95);
  });
});
