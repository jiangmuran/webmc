import { describe, it, expect } from 'vitest';
import { grassTint, foliageTint, redstoneTint, waterTintForBiome } from './tint_index_apply';

describe('tint index apply', () => {
  it('grass differs by biome', () => {
    expect(grassTint(0.1, 0.1)).not.toBe(grassTint(0.9, 0.9));
  });

  it('foliage clears red channel', () => {
    expect(foliageTint(0.5, 0.5) & 0xff0000).toBe(0);
  });

  it('redstone darker at 0', () => {
    expect(redstoneTint(0)).toBeLessThan(redstoneTint(15));
  });

  it('redstone r capped 255', () => {
    expect(redstoneTint(15) & 0xff0000).toBe(255 << 16);
  });

  it('water tint monotone in temperature', () => {
    expect(waterTintForBiome(0) & 0xff).toBeGreaterThan(waterTintForBiome(1) & 0xff);
  });
});
