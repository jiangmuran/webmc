import { describe, it, expect } from 'vitest';
import { traitsOf, isNetherBiome } from './nether_biome_registry';

describe('nether biome registry', () => {
  it('wastes floor is netherrack', () => {
    expect(traitsOf('nether_wastes').floorBlock).toBe('netherrack');
  });

  it('crimson floor is crimson_nylium', () => {
    expect(traitsOf('crimson_forest').floorBlock).toBe('crimson_nylium');
  });

  it('isNetherBiome check', () => {
    expect(isNetherBiome('crimson_forest')).toBe(true);
    expect(isNetherBiome('plains')).toBe(false);
  });
});
