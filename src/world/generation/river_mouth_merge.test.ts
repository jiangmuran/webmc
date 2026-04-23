import { describe, it, expect } from 'vitest';
import { isRiverMouth, mergedWidthAt, flowDirection } from './river_mouth_merge';

describe('river mouth merge', () => {
  it('wide river at ocean is mouth', () => {
    expect(isRiverMouth({ x: 0, z: 0, width: 6 }, true)).toBe(true);
  });

  it('narrow river not mouth', () => {
    expect(isRiverMouth({ x: 0, z: 0, width: 2 }, true)).toBe(false);
  });

  it('far from ocean no mouth', () => {
    expect(isRiverMouth({ x: 0, z: 0, width: 10 }, false)).toBe(false);
  });

  it('width transitions', () => {
    expect(mergedWidthAt(0, 4, 20)).toBeCloseTo(20);
    expect(mergedWidthAt(32, 4, 20)).toBeCloseTo(4);
  });

  it('flow normalized', () => {
    const d = flowDirection({ x: 0, z: 0, width: 1 }, { x: 3, z: 4, width: 1 });
    expect(Math.hypot(d.dx, d.dz)).toBeCloseTo(1);
  });

  it('same point safe', () => {
    const d = flowDirection({ x: 0, z: 0, width: 1 }, { x: 0, z: 0, width: 1 });
    expect(Number.isFinite(d.dx)).toBe(true);
  });
});
