import { describe, it, expect } from 'vitest';
import { badOmenAmplifier, drinkDurationTicks, returnsEmptyBottle } from './ominous_bottle_effect';

describe('ominous bottle effect', () => {
  it('clamps high', () => {
    expect(badOmenAmplifier({ amplifier: 10 })).toBeLessThanOrEqual(5);
  });

  it('clamps low', () => {
    expect(badOmenAmplifier({ amplifier: -1 })).toBe(0);
  });

  it('drink duration positive', () => {
    expect(drinkDurationTicks()).toBeGreaterThan(0);
  });

  it('returns empty bottle', () => {
    expect(returnsEmptyBottle()).toBe(true);
  });
});
