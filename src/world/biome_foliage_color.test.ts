import { describe, it, expect } from 'vitest';
import { blendFoliage, foliageOf } from './biome_foliage_color';

describe('biome foliage color', () => {
  it('plains is pale green', () => {
    const g = foliageOf('plains').grass;
    expect(g[0]).toBeGreaterThan(100);
    expect(g[1]).toBeGreaterThan(150);
  });

  it('swamp has brown-ish grass', () => {
    const g = foliageOf('swamp').grass;
    expect(g[0]).toBeLessThan(120);
    expect(g[2]).toBeLessThan(80);
  });

  it('unknown biome returns default', () => {
    const a = foliageOf('xyz');
    const b = foliageOf('forest');
    expect(a).toEqual(b);
  });

  it('single-biome blend = that biome', () => {
    const b = blendFoliage([{ biome: 'plains', weight: 1 }]);
    expect(b).toEqual(foliageOf('plains'));
  });

  it('equal blend averages RGB', () => {
    const b = blendFoliage([
      { biome: 'plains', weight: 1 },
      { biome: 'swamp', weight: 1 },
    ]);
    const a = foliageOf('plains').grass;
    const s = foliageOf('swamp').grass;
    expect(b.grass[0]).toBe(Math.round((a[0] + s[0]) / 2));
  });

  it('empty samples = default', () => {
    const b = blendFoliage([]);
    expect(b.grass).toEqual(foliageOf('forest').grass);
  });
});
