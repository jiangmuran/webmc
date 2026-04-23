import { describe, it, expect } from 'vitest';
import { redTintAlpha, tintColor, TINT_DURATION_TICKS } from './damage_tint_red';

describe('damage red tint', () => {
  it('full at hit', () => {
    expect(redTintAlpha(0)).toBe(1);
  });

  it('fades to zero', () => {
    expect(redTintAlpha(TINT_DURATION_TICKS)).toBe(0);
  });

  it('negative safe', () => {
    expect(redTintAlpha(-1)).toBe(0);
  });

  it('color is red', () => {
    const [r, g, b] = tintColor(0);
    expect(r).toBe(1);
    expect(g).toBe(0);
    expect(b).toBe(0);
  });

  it('alpha halved max', () => {
    const [, , , a] = tintColor(0);
    expect(a).toBeCloseTo(0.5);
  });
});
