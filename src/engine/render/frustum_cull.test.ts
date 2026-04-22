import { describe, it, expect } from 'vitest';
import { aabbIntersectsFrustum, aabbToPlanes, chunkAabb } from './frustum_cull';

describe('frustum culling', () => {
  const frustum = aabbToPlanes({
    minX: 0,
    minY: 0,
    minZ: 0,
    maxX: 100,
    maxY: 100,
    maxZ: 100,
  });

  it('AABB inside the box is visible', () => {
    const a = chunkAabb(1, 1, 50, 60);
    expect(aabbIntersectsFrustum(a, frustum)).toBe(true);
  });

  it('AABB entirely outside is culled', () => {
    const a = chunkAabb(-10, 0, 50, 60);
    expect(aabbIntersectsFrustum(a, frustum)).toBe(false);
  });

  it('AABB crossing the boundary is visible', () => {
    const a = chunkAabb(6, 6, 90, 110);
    expect(aabbIntersectsFrustum(a, frustum)).toBe(true);
  });

  it('chunkAabb is world-aligned to 16', () => {
    const a = chunkAabb(0, 0, 0, 256);
    expect(a.minX).toBe(0);
    expect(a.maxX).toBe(16);
  });

  it('chunk at (-1,-1) starts at (-16,-16)', () => {
    const a = chunkAabb(-1, -1, 0, 16);
    expect(a.minX).toBe(-16);
    expect(a.minZ).toBe(-16);
  });
});
