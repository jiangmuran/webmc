import { describe, it, expect } from 'vitest';
import { findInterpolants, lerpPos, pruneOld } from './snapshot_interp';

const a = { timestampMs: 0, x: 0, y: 0, z: 0 };
const b = { timestampMs: 100, x: 10, y: 0, z: 0 };
const c = { timestampMs: 200, x: 20, y: 0, z: 0 };

describe('snapshot interp', () => {
  it('picks bracket', () => {
    const r = findInterpolants([a, b, c], 50);
    expect(r?.from).toBe(a);
    expect(r?.to).toBe(b);
    expect(r?.t).toBeCloseTo(0.5);
  });

  it('no bracket for old', () => {
    expect(findInterpolants([b, c], -10)).toBeNull();
  });

  it('lerp midway', () => {
    expect(lerpPos(a, b, 0.5).x).toBeCloseTo(5);
  });

  it('prune old', () => {
    expect(pruneOld([a, b, c], 200, 100).length).toBe(2);
  });
});
