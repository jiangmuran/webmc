import { describe, it, expect } from 'vitest';
import { priority, nextToRemesh } from './chunk_dirty_priority';

describe('chunk dirty priority', () => {
  it('closer beats farther at same age', () => {
    const near = { dx: 1, dz: 1, lastDirtyTick: 0 };
    const far = { dx: 10, dz: 10, lastDirtyTick: 0 };
    expect(priority(near, 0)).toBeGreaterThan(priority(far, 0));
  });

  it('older priority beats newer', () => {
    const old = { dx: 5, dz: 5, lastDirtyTick: 0 };
    const fresh = { dx: 5, dz: 5, lastDirtyTick: 100 };
    expect(priority(old, 100)).toBeGreaterThan(priority(fresh, 100));
  });

  it('empty list undefined', () => {
    expect(nextToRemesh([], 0)).toBeUndefined();
  });

  it('picks top', () => {
    expect(
      nextToRemesh(
        [
          { dx: 10, dz: 10, lastDirtyTick: 0 },
          { dx: 1, dz: 1, lastDirtyTick: 0 },
        ],
        0,
      )?.dx,
    ).toBe(1);
  });
});
