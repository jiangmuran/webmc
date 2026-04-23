import { describe, it, expect } from 'vitest';
import { averageHeight, mixColorRGB, dominantBiome } from './biome_blend_weights';

describe('biome blend weights', () => {
  it('weighted height', () => {
    const h = averageHeight([
      { biomeId: 'a', weight: 1, baseHeight: 60, amplitude: 10 },
      { biomeId: 'b', weight: 3, baseHeight: 100, amplitude: 20 },
    ]);
    expect(h).toBeGreaterThan(60);
    expect(h).toBeLessThan(120);
  });

  it('zero weight zero height', () => {
    expect(averageHeight([])).toBe(0);
  });

  it('mix colors', () => {
    const c = mixColorRGB([
      { rgb: 0xff0000, weight: 1 },
      { rgb: 0x0000ff, weight: 1 },
    ]);
    const r = (c >> 16) & 0xff;
    const b = c & 0xff;
    expect(r).toBe(128);
    expect(b).toBe(128);
  });

  it('dominant biome', () => {
    expect(
      dominantBiome([
        { biomeId: 'plains', weight: 0.3, baseHeight: 0, amplitude: 0 },
        { biomeId: 'forest', weight: 0.6, baseHeight: 0, amplitude: 0 },
      ]),
    ).toBe('forest');
  });

  it('no samples null', () => {
    expect(dominantBiome([])).toBeNull();
  });
});
