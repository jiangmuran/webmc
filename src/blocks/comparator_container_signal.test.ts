import { describe, it, expect } from 'vitest';
import { comparatorSignalForContainer } from './comparator_container_signal';

describe('comparator container signal', () => {
  it('empty container 0', () => {
    const s = Array.from({ length: 27 }, () => ({ count: 0, maxStack: 64 }));
    expect(comparatorSignalForContainer(s)).toBe(0);
  });

  it('single item lights to 1', () => {
    const s = Array.from({ length: 27 }, (_, i) => ({
      count: i === 0 ? 1 : 0,
      maxStack: 64,
    }));
    expect(comparatorSignalForContainer(s)).toBe(1);
  });

  it('full container 15', () => {
    const s = Array.from({ length: 27 }, () => ({ count: 64, maxStack: 64 }));
    expect(comparatorSignalForContainer(s)).toBe(15);
  });

  it('zero slots', () => {
    expect(comparatorSignalForContainer([])).toBe(0);
  });

  it('half full grows signal', () => {
    const s = Array.from({ length: 27 }, () => ({ count: 32, maxStack: 64 }));
    const signal = comparatorSignalForContainer(s);
    expect(signal).toBeGreaterThan(1);
    expect(signal).toBeLessThan(15);
  });
});
