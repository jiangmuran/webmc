import { describe, it, expect } from 'vitest';
import { applyWeatherTint, sampleFog } from './fog_lut';

describe('fog LUT', () => {
  it('midnight = darkest blue', () => {
    const f = sampleFog(18000);
    expect(f.color[2]).toBeGreaterThan(f.color[0]);
  });

  it('noon = light-blue sky', () => {
    const f = sampleFog(6000);
    expect(f.color[0]).toBeGreaterThan(100);
    expect(f.density).toBeLessThan(0.5);
  });

  it('time interpolates smoothly', () => {
    const midday = sampleFog(7000);
    const noon = sampleFog(6000);
    expect(Math.abs(midday.color[0] - noon.color[0])).toBeLessThan(10);
  });

  it('weather tint darkens + thickens', () => {
    const noon = sampleFog(6000);
    const rainy = applyWeatherTint(noon, 1, 0);
    expect(rainy.density).toBeGreaterThan(noon.density);
    expect(rainy.color[0]).toBeLessThan(noon.color[0]);
  });

  it('time wraps past 24000', () => {
    const a = sampleFog(6000);
    const b = sampleFog(30000);
    expect(a.color).toEqual(b.color);
  });
});
