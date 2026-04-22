import { describe, it, expect } from 'vitest';
import { comparatorFillSignal, compareModeOutput, subtractModeOutput } from './comparator_compare';

describe('comparator', () => {
  it('empty container = 0', () => {
    expect(comparatorFillSignal({ slots: [], slotCount: 27 })).toBe(0);
  });

  it('full container = 15', () => {
    const slots = Array.from({ length: 27 }, () => ({
      item: 'webmc:stone',
      count: 64,
      maxStack: 64,
    }));
    expect(comparatorFillSignal({ slots, slotCount: 27 })).toBe(15);
  });

  it('half full = mid signal', () => {
    const slots = Array.from({ length: 27 }, () => ({
      item: 'webmc:stone',
      count: 32,
      maxStack: 64,
    }));
    const sig = comparatorFillSignal({ slots, slotCount: 27 });
    expect(sig).toBeGreaterThan(5);
    expect(sig).toBeLessThan(10);
  });

  it('subtract mode', () => {
    expect(subtractModeOutput({ front: 10, sideLeft: 3, sideRight: 4 })).toBe(6);
    expect(subtractModeOutput({ front: 5, sideLeft: 10, sideRight: 0 })).toBe(0);
  });

  it('compare mode passes or zeros', () => {
    expect(compareModeOutput({ front: 10, sideLeft: 3, sideRight: 4 })).toBe(10);
    expect(compareModeOutput({ front: 5, sideLeft: 10, sideRight: 0 })).toBe(0);
  });
});
