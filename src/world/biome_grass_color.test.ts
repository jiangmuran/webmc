import { describe, it, expect } from 'vitest';
import { grassColor, SWAMP_COLOR, darkForestBlend } from './biome_grass_color';

describe('biome grass color', () => {
  it('returns valid RGB 0..255', () => {
    const c = grassColor({ temperature: 0.5, downfall: 0.5 });
    expect(c.r).toBeGreaterThanOrEqual(0);
    expect(c.r).toBeLessThanOrEqual(255);
    expect(c.g).toBeLessThanOrEqual(255);
    expect(c.b).toBeLessThanOrEqual(255);
  });

  it('swamp constant', () => {
    expect(SWAMP_COLOR.r).toBe(106);
  });

  it('dark forest blend averages', () => {
    const blend = darkForestBlend({ r: 100, g: 100, b: 100 });
    expect(blend.r).toBe(70);
    expect(blend.g).toBe(80);
    expect(blend.b).toBe(65);
  });

  it('deterministic', () => {
    const a = grassColor({ temperature: 0.7, downfall: 0.3 });
    const b = grassColor({ temperature: 0.7, downfall: 0.3 });
    expect(a).toEqual(b);
  });
});
