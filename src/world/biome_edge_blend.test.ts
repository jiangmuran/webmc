import { describe, it, expect } from 'vitest';
import { blendSample, dominantBiome, type BiomeSample } from './biome_edge_blend';

function sample(id: string, t: number, h: number, v: number): BiomeSample {
  return { biomeId: id, temperature: t, baseHeight: h, heightVariation: v };
}

describe('biome blend', () => {
  it('averages uniform', () => {
    const r = blendSample({ at: () => sample('plains', 0.8, 63, 0.1) });
    expect(r.temperature).toBeCloseTo(0.8);
    expect(r.baseHeight).toBe(63);
  });

  it('edge averages', () => {
    const r = blendSample({
      at: (dx) => (dx < 0 ? sample('plains', 0.8, 60, 0) : sample('desert', 2.0, 65, 0)),
    });
    expect(r.temperature).toBeGreaterThan(0.8);
    expect(r.temperature).toBeLessThan(2.0);
  });

  it('dominant biome', () => {
    expect(
      dominantBiome({
        at: (dx) => (dx < 0 ? sample('plains', 0.8, 0, 0) : sample('desert', 2, 0, 0)),
      }),
    ).toBeDefined();
  });
});
