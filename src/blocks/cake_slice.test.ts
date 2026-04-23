import { describe, it, expect } from 'vitest';
import { bite, craftCake, TOTAL_BITES } from './cake_slice';

describe('cake slice', () => {
  it('craft has 7 bites', () => {
    expect(craftCake().bitesRemaining).toBe(TOTAL_BITES);
  });

  it('bite when hungry eats', () => {
    const r = bite({ bitesRemaining: 7 }, false);
    expect(r.kind).toBe('ate');
  });

  it('not hungry refuses', () => {
    expect(bite({ bitesRemaining: 7 }, true).kind).toBe('not_hungry');
  });

  it('last bite removes', () => {
    expect(bite({ bitesRemaining: 1 }, false).kind).toBe('removed');
  });

  it('hunger + saturation per bite', () => {
    const r = bite({ bitesRemaining: 5 }, false);
    if (r.kind === 'ate') {
      expect(r.hungerGained).toBe(2);
      expect(r.saturationGained).toBeGreaterThan(0);
    }
  });
});
