import { describe, it, expect } from 'vitest';
import { timeUntilAdult, isAdult, rideableAsBaby } from './baby_mob_growth';

describe('baby mob growth', () => {
  it('new baby takes full time', () => {
    expect(timeUntilAdult({ ageTicks: 0, recentlyFedTicks: 0 })).toBeGreaterThan(0);
  });

  it('feeding speeds up', () => {
    const baseline = timeUntilAdult({ ageTicks: 0, recentlyFedTicks: 0 });
    const fed = timeUntilAdult({ ageTicks: 0, recentlyFedTicks: 1000 });
    expect(fed).toBeLessThan(baseline);
  });

  it('adult at age limit', () => {
    expect(isAdult({ ageTicks: 50000, recentlyFedTicks: 0 })).toBe(true);
  });

  it('only chicken rideable as baby', () => {
    expect(rideableAsBaby('chicken')).toBe(true);
    expect(rideableAsBaby('pig')).toBe(false);
  });
});
