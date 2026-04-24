import { describe, it, expect } from 'vitest';
import { fogColorForBiome, fogStartDistance } from './biome_fog_override';

describe('biome fog override', () => {
  it('nether red tint', () => {
    const [r, g, b] = fogColorForBiome('nether_wastes', 'day');
    expect(r).toBeGreaterThan(g);
    expect(r).toBeGreaterThan(b);
  });

  it('warped cyan', () => {
    const [r, g, b] = fogColorForBiome('warped_forest', 'day');
    expect(b).toBeGreaterThan(r);
    expect(g).toBeGreaterThan(r);
  });

  it('end dark', () => {
    expect(fogColorForBiome('the_end', 'day')).toEqual([0, 0, 0]);
  });

  it('night dark blue', () => {
    const [r, g, b] = fogColorForBiome('plains', 'night');
    expect(b).toBeGreaterThan(r);
    expect(b).toBeGreaterThan(g);
  });

  it('basalt deltas close fog', () => {
    expect(fogStartDistance('basalt_deltas')).toBeLessThan(fogStartDistance('plains'));
  });
});
