import { describe, it, expect } from 'vitest';
import { eventAmount, isPositive, MAJOR_POSITIVE_CURE } from './villager_cure_reputation';

describe('villager cure reputation', () => {
  it('cure amount', () => {
    expect(eventAmount('cure')).toBe(MAJOR_POSITIVE_CURE);
  });

  it('kill positive amount numeric', () => {
    expect(eventAmount('kill_villager')).toBeGreaterThan(0);
  });

  it('positive kinds', () => {
    expect(isPositive('cure')).toBe(true);
    expect(isPositive('trade')).toBe(true);
    expect(isPositive('kill_villager')).toBe(false);
  });
});
