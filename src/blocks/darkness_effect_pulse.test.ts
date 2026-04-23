import { describe, it, expect } from 'vitest';
import { pulseFactor, viewDistanceMultiplier } from './darkness_effect_pulse';

describe('darkness effect pulse', () => {
  it('no effect when not active', () => {
    expect(pulseFactor({ remainingTicks: 0, amplifier: 0 }, 0)).toBe(0);
  });

  it('nonzero during effect', () => {
    const f = pulseFactor({ remainingTicks: 200, amplifier: 0 }, 5);
    expect(f).toBeGreaterThan(0);
  });

  it('tail fades', () => {
    const strong = pulseFactor({ remainingTicks: 200, amplifier: 0 }, 5);
    const weak = pulseFactor({ remainingTicks: 10, amplifier: 0 }, 5);
    expect(weak).toBeLessThan(strong);
  });

  it('view distance reduced at peak', () => {
    const m = viewDistanceMultiplier({ remainingTicks: 200, amplifier: 0 }, 5);
    expect(m).toBeLessThanOrEqual(1);
    expect(m).toBeGreaterThan(0);
  });

  it('view unchanged at rest', () => {
    expect(viewDistanceMultiplier({ remainingTicks: 0, amplifier: 0 }, 0)).toBe(1);
  });
});
