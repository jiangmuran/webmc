import { describe, it, expect } from 'vitest';
import { ddaRaycast } from './raytrace_dda';

describe('dda raycast', () => {
  it('finds block straight ahead', () => {
    const hit = ddaRaycast({ x: 0.5, y: 0.5, z: 0.5, dx: 1, dy: 0, dz: 0 }, 10, {
      isSolid: (x) => x === 3,
    });
    expect(hit?.x).toBe(3);
  });

  it('returns null when nothing hit', () => {
    const hit = ddaRaycast({ x: 0.5, y: 0.5, z: 0.5, dx: 1, dy: 0, dz: 0 }, 5, {
      isSolid: () => false,
    });
    expect(hit).toBeNull();
  });

  it('reports face', () => {
    const hit = ddaRaycast({ x: 0.5, y: 0.5, z: 0.5, dx: 1, dy: 0, dz: 0 }, 10, {
      isSolid: (x) => x === 3,
    });
    expect(hit?.face).toBe('west');
  });

  it('max distance stops', () => {
    const hit = ddaRaycast({ x: 0.5, y: 0.5, z: 0.5, dx: 1, dy: 0, dz: 0 }, 1, {
      isSolid: (x) => x === 10,
    });
    expect(hit).toBeNull();
  });
});
