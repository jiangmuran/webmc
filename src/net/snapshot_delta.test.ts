import { describe, it, expect } from 'vitest';
import { applyDelta, deltaByteSize, diffSnapshot, type EntitySnapshot } from './snapshot_delta';

const BASE: EntitySnapshot = {
  id: 42,
  x: 100,
  y: 60,
  z: 0,
  yaw: 0,
  pitch: 0,
  vx: 0,
  vy: 0,
  vz: 0,
};

describe('snapshot delta', () => {
  it('no change = null delta', () => {
    expect(diffSnapshot(BASE, BASE)).toBeNull();
  });

  it('x shift produces dx', () => {
    const d = diffSnapshot(BASE, { ...BASE, x: 101 });
    expect(d?.dx).toBeCloseTo(1);
    expect(d?.dy).toBeUndefined();
  });

  it('apply round-trips', () => {
    const next = { ...BASE, x: 105, yaw: 0.3 };
    const d = diffSnapshot(BASE, next);
    if (!d) throw new Error('expected delta');
    const applied = applyDelta(BASE, d);
    expect(applied.x).toBeCloseTo(next.x);
    expect(applied.yaw).toBeCloseTo(next.yaw);
  });

  it('id mismatch throws', () => {
    expect(() => diffSnapshot(BASE, { ...BASE, id: 99 })).toThrow();
  });

  it('delta byte size scales with set fields', () => {
    const d1 = diffSnapshot(BASE, { ...BASE, x: 1 });
    const d2 = diffSnapshot(BASE, { ...BASE, x: 1, y: 1, z: 1 });
    if (!d1 || !d2) throw new Error();
    expect(deltaByteSize(d2)).toBeGreaterThan(deltaByteSize(d1));
  });
});
