import { describe, it, expect } from 'vitest';
import { isTallBirchBiome, rollHeight, logType } from './tree_birch';

describe('birch tree', () => {
  it('old growth is tall biome', () => {
    expect(isTallBirchBiome('old_growth_birch_forest')).toBe(true);
    expect(isTallBirchBiome('plains')).toBe(false);
  });

  it('normal height 5-7', () => {
    for (let i = 0; i < 10; i++) {
      const h = rollHeight('plains', () => 0.5);
      expect(h).toBeGreaterThanOrEqual(5);
      expect(h).toBeLessThanOrEqual(7);
    }
  });

  it('tall variant sometimes spawns', () => {
    const h = rollHeight('old_growth_birch_forest', () => 0);
    expect(h).toBeGreaterThanOrEqual(10);
  });

  it('drops birch log', () => {
    expect(logType()).toBe('birch_log');
  });
});
