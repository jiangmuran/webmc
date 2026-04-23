import { describe, it, expect } from 'vitest';
import { shouldSleep, isWorkTime } from './villager_sleep';

describe('villager sleep', () => {
  it('sleeps at night with bed', () => {
    expect(shouldSleep({ timeOfDay: 14000, hasBedClaimed: true, isRaidActive: false })).toBe(true);
  });

  it('no bed no sleep', () => {
    expect(shouldSleep({ timeOfDay: 14000, hasBedClaimed: false, isRaidActive: false })).toBe(
      false,
    );
  });

  it('raid blocks sleep', () => {
    expect(shouldSleep({ timeOfDay: 14000, hasBedClaimed: true, isRaidActive: true })).toBe(false);
  });

  it('work in morning', () => {
    expect(isWorkTime({ timeOfDay: 3000, hasBedClaimed: true, isRaidActive: false })).toBe(true);
  });

  it('no work at night', () => {
    expect(isWorkTime({ timeOfDay: 14000, hasBedClaimed: true, isRaidActive: false })).toBe(false);
  });
});
