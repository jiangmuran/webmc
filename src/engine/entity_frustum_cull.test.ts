import { describe, it, expect } from 'vitest';
import { entityVisible, sphereBehindPlane } from './entity_frustum_cull';

const nearPlane = { nx: 0, ny: 0, nz: 1, d: 0 };

describe('entity frustum cull', () => {
  it('sphere in front visible', () => {
    expect(entityVisible([nearPlane], { x: 0, y: 0, z: 10, boundingRadius: 1 })).toBe(true);
  });

  it('sphere behind culled', () => {
    expect(entityVisible([nearPlane], { x: 0, y: 0, z: -10, boundingRadius: 1 })).toBe(false);
  });

  it('large radius keeps visible across plane', () => {
    expect(sphereBehindPlane(nearPlane, { cx: 0, cy: 0, cz: -2, radius: 3 })).toBe(false);
  });
});
