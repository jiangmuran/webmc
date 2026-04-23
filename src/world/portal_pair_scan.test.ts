import { describe, it, expect } from 'vitest';
import { nearestPortal, shouldCreateIfNone } from './portal_pair_scan';

describe('portal pair scan', () => {
  it('picks nearest in radius', () => {
    const p = nearestPortal(
      [
        { x: 10, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
      ],
      { x: 0, y: 0, z: 0 },
      128,
    );
    expect(p?.x).toBe(2);
  });

  it('ignores out-of-radius', () => {
    const p = nearestPortal([{ x: 500, y: 0, z: 0 }], { x: 0, y: 0, z: 0 }, 128);
    expect(p).toBeUndefined();
  });

  it('empty list', () => {
    expect(nearestPortal([], { x: 0, y: 0, z: 0 }, 128)).toBeUndefined();
  });

  it('creates when none', () => {
    expect(shouldCreateIfNone(undefined)).toBe(true);
    expect(shouldCreateIfNone({ x: 0, y: 0, z: 0 })).toBe(false);
  });
});
