import { describe, it, expect } from 'vitest';
import { wantsToVisitFlower, wantsToReturnHome } from './bee_flower_pollinate';

describe('bee flower pollinate', () => {
  it('empty visits flower', () => {
    expect(wantsToVisitFlower({ hasPollen: false, nearbyFlowerBlock: 'dandelion' })).toBe(true);
  });

  it('full skips', () => {
    expect(wantsToVisitFlower({ hasPollen: true, nearbyFlowerBlock: 'dandelion' })).toBe(false);
  });

  it('non-flower skipped', () => {
    expect(wantsToVisitFlower({ hasPollen: false, nearbyFlowerBlock: 'stone' })).toBe(false);
  });

  it('returns home when loaded', () => {
    expect(wantsToReturnHome({ hasPollen: true, nearbyHive: true })).toBe(true);
  });

  it('no hive no return', () => {
    expect(wantsToReturnHome({ hasPollen: true })).toBe(false);
  });
});
