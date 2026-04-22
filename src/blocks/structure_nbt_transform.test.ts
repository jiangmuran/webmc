import { describe, it, expect } from 'vitest';
import { rotate, mirror, transform } from './structure_nbt_transform';

describe('structure nbt transform', () => {
  it('rotation 0 identity', () => {
    expect(rotate({ x: 1, y: 2, z: 3 }, 0)).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('rotation 90', () => {
    expect(rotate({ x: 1, y: 0, z: 0 }, 90)).toEqual({ x: 0, y: 0, z: 1 });
  });

  it('rotation 180', () => {
    expect(rotate({ x: 1, y: 0, z: 2 }, 180)).toEqual({ x: -1, y: 0, z: -2 });
  });

  it('mirror x', () => {
    expect(mirror({ x: 1, y: 0, z: 2 }, 'x')).toEqual({ x: -1, y: 0, z: 2 });
  });

  it('mirror z', () => {
    expect(mirror({ x: 1, y: 0, z: 2 }, 'z')).toEqual({ x: 1, y: 0, z: -2 });
  });

  it('combined mirror then rotate', () => {
    const r = transform({ x: 1, y: 0, z: 0 }, 90, 'x');
    expect(r).toEqual({ x: 0, y: 0, z: -1 });
  });

  it('y preserved', () => {
    expect(transform({ x: 0, y: 7, z: 0 }, 180, 'x').y).toBe(7);
  });
});
