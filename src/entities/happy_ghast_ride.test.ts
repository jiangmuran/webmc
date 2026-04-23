import { describe, it, expect } from 'vitest';
import { canCarryMore, canFlyOnlyWithHarness, MAX_RIDERS } from './happy_ghast_ride';

describe('happy ghast ride', () => {
  it('needs harness', () => {
    expect(canCarryMore({ riderCount: 0, harnessEquipped: false })).toBe(false);
  });

  it('up to 4 riders', () => {
    expect(canCarryMore({ riderCount: 3, harnessEquipped: true })).toBe(true);
    expect(canCarryMore({ riderCount: MAX_RIDERS, harnessEquipped: true })).toBe(false);
  });

  it('harness unlocks flight', () => {
    expect(canFlyOnlyWithHarness({ riderCount: 0, harnessEquipped: true })).toBe(true);
    expect(canFlyOnlyWithHarness({ riderCount: 0, harnessEquipped: false })).toBe(false);
  });
});
