import { describe, it, expect } from 'vitest';
import { tickGrassBlock, type GrassLookup } from './grass_spread';

function lookup(opts: Partial<GrassLookup> = {}): GrassLookup {
  return {
    isGrass: () => false,
    isDirt: () => false,
    lightAbove: () => 15,
    hasOpaqueAbove: () => false,
    ...opts,
  };
}

describe('grass spread', () => {
  it('grass under opaque block decays', () => {
    const placements = tickGrassBlock({
      center: { x: 0, y: 0, z: 0 },
      lookup: lookup({ isGrass: () => true, hasOpaqueAbove: () => true }),
      rng: () => 0.01,
    });
    expect(placements.some((p) => p.block === 'webmc:dirt')).toBe(true);
  });

  it('grass spreads to adjacent dirt in light', () => {
    const placements = tickGrassBlock({
      center: { x: 0, y: 0, z: 0 },
      lookup: lookup({ isGrass: () => true, isDirt: (x, y, z) => x === 1 && y === 0 && z === 0 }),
      rng: () => 0.05,
    });
    expect(placements.some((p) => p.block === 'webmc:grass_block')).toBe(true);
  });

  it('no spread if light too low', () => {
    const placements = tickGrassBlock({
      center: { x: 0, y: 0, z: 0 },
      lookup: lookup({ isGrass: () => true, isDirt: () => true, lightAbove: () => 4 }),
      rng: () => 0.05,
    });
    expect(placements.length).toBe(0);
  });

  it('no spread from non-grass center', () => {
    const placements = tickGrassBlock({
      center: { x: 0, y: 0, z: 0 },
      lookup: lookup({ isGrass: () => false, isDirt: () => true }),
      rng: () => 0.05,
    });
    expect(placements.length).toBe(0);
  });
});
