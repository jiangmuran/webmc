import { describe, it, expect } from 'vitest';
import { findExisting, chooseBuildSpot, SEARCH_RADIUS } from './portal_link_search';

describe('portal link search', () => {
  it('empty index → null', () => {
    expect(findExisting({ portals: [] }, { x: 0, y: 0, z: 0 })).toBeNull();
  });

  it('finds nearest in range', () => {
    const r = findExisting(
      {
        portals: [
          { x: 10, y: 64, z: 0 },
          { x: 200, y: 64, z: 0 },
        ],
      },
      { x: 0, y: 64, z: 0 },
    );
    expect(r?.x).toBe(10);
  });

  it('ignores out of range', () => {
    expect(
      findExisting({ portals: [{ x: SEARCH_RADIUS + 10, y: 64, z: 0 }] }, { x: 0, y: 64, z: 0 }),
    ).toBeNull();
  });

  it('build spot clamps y', () => {
    expect(chooseBuildSpot({ x: 0, y: 300, z: 0 }).y).toBe(96);
    expect(chooseBuildSpot({ x: 0, y: -100, z: 0 }).y).toBe(32);
  });
});
