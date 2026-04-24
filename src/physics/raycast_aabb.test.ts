import { describe, it, expect } from 'vitest';
import { intersectRayAABB } from './raycast_aabb';

describe('intersectRayAABB', () => {
  const box = { minX: 0, minY: 0, minZ: 0, maxX: 1, maxY: 1, maxZ: 1 };

  it('hits ahead along +X', () => {
    const h = intersectRayAABB({ x: -2, y: 0.5, z: 0.5 }, { x: 1, y: 0, z: 0 }, box, 10);
    expect(h).not.toBeNull();
    expect(h?.tMin).toBeCloseTo(2, 5);
  });

  it('misses above', () => {
    const h = intersectRayAABB({ x: -2, y: 5, z: 0.5 }, { x: 1, y: 0, z: 0 }, box, 10);
    expect(h).toBeNull();
  });

  it('ignores behind-origin hits', () => {
    const h = intersectRayAABB({ x: 5, y: 0.5, z: 0.5 }, { x: 1, y: 0, z: 0 }, box, 10);
    expect(h).toBeNull();
  });

  it('ray from inside returns tMin=0', () => {
    const h = intersectRayAABB({ x: 0.5, y: 0.5, z: 0.5 }, { x: 1, y: 0, z: 0 }, box, 10);
    expect(h?.tMin).toBe(0);
    expect(h?.tMax).toBeCloseTo(0.5, 5);
  });

  it('respects maxDist', () => {
    const h = intersectRayAABB({ x: -2, y: 0.5, z: 0.5 }, { x: 1, y: 0, z: 0 }, box, 1);
    expect(h).toBeNull();
  });
});
