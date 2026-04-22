import { describe, it, expect } from 'vitest';
import { aabbInFrustum, aabbOutsidePlane, cachedVisible, type Plane } from './frustum_cull';

describe('frustum cull', () => {
  const nearPlane: Plane = { a: 0, b: 0, c: 1, d: -10 }; // z >= 10
  const box = { minX: 0, minY: 0, minZ: 20, maxX: 1, maxY: 1, maxZ: 21 };

  it('visible behind plane', () => {
    expect(aabbOutsidePlane(nearPlane, box)).toBe(false);
  });

  it('culled in front', () => {
    const culled = { ...box, minZ: 0, maxZ: 5 };
    expect(aabbOutsidePlane(nearPlane, culled)).toBe(true);
  });

  it('inFrustum across all', () => {
    expect(aabbInFrustum([nearPlane], box)).toBe(true);
  });

  it('cached visible refreshes', () => {
    const cache = { lastCheckTick: 0, visible: false };
    let calls = 0;
    const r = cachedVisible(cache, 100, () => {
      calls += 1;
      return true;
    });
    expect(r).toBe(true);
    expect(calls).toBe(1);
    cachedVisible(cache, 101, () => {
      calls += 1;
      return false;
    });
    expect(calls).toBe(1);
  });
});
