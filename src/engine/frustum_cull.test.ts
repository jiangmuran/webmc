import { describe, it, expect } from 'vitest';
import { aabbInFrustum, makePlane, type AABB } from './frustum_cull';

const halfSpaceX: AABB = {
  min: { x: -10, y: -10, z: -10 },
  max: { x: 10, y: 10, z: 10 },
};

// Single plane: x >= 0 (normal +x).
const planes = [makePlane(1, 0, 0, 0)];

describe('frustum cull', () => {
  it('straddling box passes', () => {
    expect(aabbInFrustum(planes, halfSpaceX)).toBe(true);
  });

  it('fully behind fails', () => {
    const box: AABB = { min: { x: -20, y: -10, z: -10 }, max: { x: -5, y: 10, z: 10 } };
    expect(aabbInFrustum(planes, box)).toBe(false);
  });

  it('fully in front passes', () => {
    const box: AABB = { min: { x: 1, y: 0, z: 0 }, max: { x: 5, y: 1, z: 1 } };
    expect(aabbInFrustum(planes, box)).toBe(true);
  });

  it('unit-normalized plane', () => {
    const p = makePlane(2, 0, 0, 4);
    expect(p.nx).toBeCloseTo(1);
    expect(p.d).toBeCloseTo(2);
  });
});
