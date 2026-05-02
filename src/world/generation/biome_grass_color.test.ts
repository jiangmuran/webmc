import { describe, it, expect } from 'vitest';
import { grassColor, foliageColor, waterTintForBiome } from './biome_grass_color';

describe('biome grass color', () => {
  it('grass produces RGB', () => {
    const c = grassColor({ temperature: 0.8, humidity: 0.5 });
    expect(c).toBeGreaterThan(0);
  });

  it('climate affects color', () => {
    const a = grassColor({ temperature: 0, humidity: 0 });
    const b = grassColor({ temperature: 1, humidity: 1 });
    expect(a).not.toBe(b);
  });

  it('foliage distinct from grass', () => {
    const c1 = grassColor({ temperature: 0.5, humidity: 0.5 });
    const c2 = foliageColor({ temperature: 0.5, humidity: 0.5 });
    expect(c1).not.toBe(c2);
  });

  it('warm ocean tropical tint', () => {
    expect(waterTintForBiome('warm_ocean')).not.toBe(waterTintForBiome('default'));
  });

  it('cold ocean distinct from frozen ocean (wiki)', () => {
    expect(waterTintForBiome('cold_ocean')).toBe(0x3d57d6);
    expect(waterTintForBiome('frozen_ocean')).toBe(0x3938c9);
    expect(waterTintForBiome('cold_ocean')).not.toBe(waterTintForBiome('frozen_ocean'));
  });

  it('lukewarm ocean has its own tint (wiki)', () => {
    expect(waterTintForBiome('lukewarm_ocean')).toBe(0x45adf2);
  });

  it('swamp murky', () => {
    const swamp = waterTintForBiome('swamp');
    const normal = waterTintForBiome('default');
    expect(swamp).not.toBe(normal);
  });
});
