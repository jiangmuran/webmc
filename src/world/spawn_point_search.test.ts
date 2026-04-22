import { describe, it, expect } from 'vitest';
import { isValidSpawn, findSpawn } from './spawn_point_search';

describe('spawn search', () => {
  it('rejects water', () => {
    expect(isValidSpawn({ groundY: 62, surfaceBlockId: 'webmc:water', skyAccess: true })).toBe(
      false,
    );
  });

  it('rejects no sky access', () => {
    expect(
      isValidSpawn({ groundY: 10, surfaceBlockId: 'webmc:grass_block', skyAccess: false }),
    ).toBe(false);
  });

  it('accepts grass with sky', () => {
    expect(
      isValidSpawn({ groundY: 64, surfaceBlockId: 'webmc:grass_block', skyAccess: true }),
    ).toBe(true);
  });

  it('finds first valid in spiral', () => {
    const r = findSpawn({
      centerX: 0,
      centerZ: 0,
      maxRadius: 10,
      column: (x, z) => {
        if (x === 2 && z === 2)
          return { groundY: 64, surfaceBlockId: 'webmc:grass_block', skyAccess: true };
        return { groundY: 62, surfaceBlockId: 'webmc:water', skyAccess: true };
      },
    });
    expect(r).toEqual({ x: 2, y: 65, z: 2 });
  });

  it('returns null if none found', () => {
    const r = findSpawn({
      centerX: 0,
      centerZ: 0,
      maxRadius: 3,
      column: () => ({ groundY: 0, surfaceBlockId: 'webmc:water', skyAccess: true }),
    });
    expect(r).toBeNull();
  });
});
