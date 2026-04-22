import { describe, it, expect } from 'vitest';
import { blendSky, lerpColor, skyOf } from './sky_color';

describe('sky color', () => {
  it('plains has the standard blue sky', () => {
    expect(skyOf('plains').sky).toEqual([0x78, 0xa7, 0xff]);
  });

  it('unknown biome falls back to plains', () => {
    expect(skyOf('xyz').sky).toEqual(skyOf('plains').sky);
  });

  it('nether has dark red-ish sky', () => {
    const n = skyOf('nether_wastes');
    expect(n.sky[0]).toBeGreaterThan(n.sky[1]);
    expect(n.sky[0]).toBeGreaterThan(n.sky[2]);
  });

  it('warm ocean water color differs from cold', () => {
    const warm = skyOf('warm_ocean').water;
    const cold = skyOf('cold_ocean').water;
    expect(warm).not.toEqual(cold);
  });

  it('lerpColor at t=0 returns a', () => {
    expect(lerpColor([1, 2, 3], [10, 20, 30], 0)).toEqual([1, 2, 3]);
  });

  it('lerpColor at t=1 returns b', () => {
    expect(lerpColor([1, 2, 3], [10, 20, 30], 1)).toEqual([10, 20, 30]);
  });

  it('blend of single biome == that biome', () => {
    const p = blendSky([{ biome: 'plains', weight: 1 }]);
    expect(p.sky).toEqual(skyOf('plains').sky);
  });

  it('blend of equal weights averages colors', () => {
    const p = blendSky([
      { biome: 'plains', weight: 1 },
      { biome: 'nether_wastes', weight: 1 },
    ]);
    const a = skyOf('plains').sky;
    const b = skyOf('nether_wastes').sky;
    expect(p.sky[0]).toBe(Math.round((a[0] + b[0]) / 2));
  });

  it('blend with empty weights falls back to plains', () => {
    expect(blendSky([]).sky).toEqual(skyOf('plains').sky);
  });
});
