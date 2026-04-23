import { describe, it, expect } from 'vitest';
import { signedDistanceToPoint, aabbBehindPlane, aabbInsideFrustum } from './frustum_plane_clip';

const nearPlane = { nx: 0, ny: 0, nz: 1, d: -1 };
const aabb = { minX: -1, minY: -1, minZ: 5, maxX: 1, maxY: 1, maxZ: 7 };

describe('frustum plane clip', () => {
  it('in front positive distance', () => {
    expect(signedDistanceToPoint(nearPlane, 0, 0, 10)).toBeGreaterThan(0);
  });

  it('behind negative distance', () => {
    expect(signedDistanceToPoint(nearPlane, 0, 0, -5)).toBeLessThan(0);
  });

  it('aabb ahead of plane → not behind', () => {
    expect(aabbBehindPlane(nearPlane, aabb)).toBe(false);
  });

  it('aabb behind plane flagged', () => {
    const behind = { minX: -1, minY: -1, minZ: -10, maxX: 1, maxY: 1, maxZ: -5 };
    expect(aabbBehindPlane(nearPlane, behind)).toBe(true);
  });

  it('in frustum', () => {
    expect(aabbInsideFrustum([nearPlane], aabb)).toBe(true);
  });
});
