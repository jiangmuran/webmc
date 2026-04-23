import { describe, it, expect } from 'vitest';
import { IDENTITY, fromAxisAngle, multiply, normalize, slerp } from './quaternion';

describe('quaternion', () => {
  it('identity', () => {
    expect(IDENTITY).toEqual({ x: 0, y: 0, z: 0, w: 1 });
  });

  it('fromAxisAngle unit', () => {
    const q = fromAxisAngle(0, 1, 0, Math.PI / 2);
    const m = Math.hypot(q.x, q.y, q.z, q.w);
    expect(m).toBeCloseTo(1);
  });

  it('multiply identity', () => {
    const q = fromAxisAngle(1, 0, 0, 1);
    expect(multiply(q, IDENTITY)).toEqual(q);
  });

  it('normalize', () => {
    const q = normalize({ x: 1, y: 1, z: 1, w: 1 });
    expect(Math.hypot(q.x, q.y, q.z, q.w)).toBeCloseTo(1);
  });

  it('slerp endpoints', () => {
    const a = IDENTITY;
    const b = fromAxisAngle(0, 1, 0, Math.PI / 2);
    expect(slerp(a, b, 0).w).toBeCloseTo(1);
    expect(slerp(a, b, 1).w).toBeCloseTo(b.w);
  });

  it('slerp midpoint unit length', () => {
    const a = IDENTITY;
    const b = fromAxisAngle(0, 1, 0, Math.PI / 2);
    const m = slerp(a, b, 0.5);
    expect(Math.hypot(m.x, m.y, m.z, m.w)).toBeCloseTo(1);
  });
});
