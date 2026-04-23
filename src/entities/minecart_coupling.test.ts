import { describe, it, expect } from 'vitest';
import { attemptCouple, blendVelocities, repelOverlap, type Cart } from './minecart_coupling';

const a: Cart = { id: 'a', x: 0, z: 0, vx: 1, vz: 0 };
const b: Cart = { id: 'b', x: 1, z: 0, vx: 0, vz: 0 };

describe('minecart coupling', () => {
  it('couple near', () => {
    expect(attemptCouple(a, b)).toBe(true);
  });

  it('no couple far', () => {
    expect(attemptCouple(a, { ...b, x: 100 })).toBe(false);
  });

  it('blend averages velocities', () => {
    const r = blendVelocities(a, b);
    expect(r.a.vx).toBeCloseTo(0.5);
    expect(r.b.vx).toBeCloseTo(0.5);
  });

  it('repel pushes apart', () => {
    const r = repelOverlap(a, b);
    expect(r.a.vx).toBeLessThan(a.vx);
    expect(r.b.vx).toBeGreaterThan(-1);
  });
});
