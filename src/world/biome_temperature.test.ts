import { describe, it, expect } from 'vitest';
import { canRain, canSnow, canSnowAt, climateOf, isDry, temperatureAt } from './biome_temperature';

describe('biome temperature', () => {
  it('desert is hot and dry', () => {
    expect(climateOf('desert').temperature).toBeGreaterThanOrEqual(2.0);
    expect(isDry('desert')).toBe(true);
  });

  it('snowy taiga can snow', () => {
    expect(canSnow('snowy_taiga')).toBe(true);
  });

  it('plains rain but no snow', () => {
    expect(canRain('plains')).toBe(true);
    expect(canSnow('plains')).toBe(false);
  });

  it('desert does not rain', () => {
    expect(canRain('desert')).toBe(false);
  });

  it('altitude cools temperature', () => {
    const low = temperatureAt('plains', 64);
    const high = temperatureAt('plains', 200);
    expect(high).toBeLessThan(low);
  });

  it('mountain peak on plains freezes', () => {
    expect(canSnowAt('plains', 1400)).toBe(true);
  });

  it('unknown biome falls back to plains', () => {
    expect(climateOf('xyz').temperature).toBe(0.8);
  });
});
