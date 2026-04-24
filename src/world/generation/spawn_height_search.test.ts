import { describe, it, expect } from 'vitest';
import { findTopSolid, findSpawnSurface } from './spawn_height_search';

describe('spawn height search', () => {
  it('finds top solid', () => {
    expect(
      findTopSolid({
        chunkX: 0,
        chunkZ: 0,
        bottomY: 0,
        topY: 100,
        isSolid: (y) => y === 50,
        isSafeAbove: () => true,
      }),
    ).toBe(50);
  });

  it('none solid undefined', () => {
    expect(
      findTopSolid({
        chunkX: 0,
        chunkZ: 0,
        bottomY: 0,
        topY: 10,
        isSolid: () => false,
        isSafeAbove: () => true,
      }),
    ).toBeUndefined();
  });

  it('spawn above surface', () => {
    expect(
      findSpawnSurface({
        chunkX: 0,
        chunkZ: 0,
        bottomY: 0,
        topY: 100,
        isSolid: (y) => y <= 64,
        isSafeAbove: () => true,
      }),
    ).toBe(65);
  });

  it('unsafe above rejects', () => {
    expect(
      findSpawnSurface({
        chunkX: 0,
        chunkZ: 0,
        bottomY: 0,
        topY: 100,
        isSolid: (y) => y <= 64,
        isSafeAbove: () => false,
      }),
    ).toBeUndefined();
  });
});
