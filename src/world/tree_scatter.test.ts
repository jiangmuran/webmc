import { describe, it, expect } from 'vitest';
import { scatterTrees, densityForBiome } from './tree_scatter';

describe('tree scatter', () => {
  it('no trees without biome', () => {
    expect(
      scatterTrees({ chunkX: 0, chunkZ: 0, seed: 1, density: 5, biomeSupportsTrees: false }),
    ).toEqual([]);
  });

  it('density count', () => {
    const t = scatterTrees({ chunkX: 0, chunkZ: 0, seed: 1, density: 8, biomeSupportsTrees: true });
    expect(t.length).toBe(8);
  });

  it('positions within 0..15', () => {
    const t = scatterTrees({
      chunkX: 0,
      chunkZ: 0,
      seed: 1,
      density: 20,
      biomeSupportsTrees: true,
    });
    for (const s of t) {
      expect(s.cx).toBeGreaterThanOrEqual(0);
      expect(s.cx).toBeLessThan(16);
      expect(s.cz).toBeGreaterThanOrEqual(0);
      expect(s.cz).toBeLessThan(16);
    }
  });

  it('deterministic per seed', () => {
    const a = scatterTrees({ chunkX: 1, chunkZ: 2, seed: 3, density: 5, biomeSupportsTrees: true });
    const b = scatterTrees({ chunkX: 1, chunkZ: 2, seed: 3, density: 5, biomeSupportsTrees: true });
    expect(a).toEqual(b);
  });

  it('biome density table', () => {
    expect(densityForBiome('dark_forest')).toBeGreaterThan(densityForBiome('plains'));
    expect(densityForBiome('desert')).toBe(0);
  });
});
