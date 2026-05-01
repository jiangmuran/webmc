import { describe, it, expect } from 'vitest';
import { adjustedTemperature, precipitationAt, canAccumulateSnow } from './biome_precipitation';

describe('precipitation', () => {
  const plains = { baseTemperature: 0.8, hasPrecipitation: true };
  const desert = { baseTemperature: 2.0, hasPrecipitation: false };
  const frozen = { baseTemperature: 0.0, hasPrecipitation: true };

  it('desert has none', () => {
    expect(precipitationAt(desert, 80)).toBe('none');
  });

  it('plains rain', () => {
    expect(precipitationAt(plains, 64)).toBe('rain');
  });

  it('frozen snow', () => {
    expect(precipitationAt(frozen, 64)).toBe('snow');
  });

  it('high altitude plains stays rain (wiki: plains base 0.8, falloff 0.00125, never snows below Y~600)', () => {
    expect(precipitationAt(plains, 320)).toBe('rain');
  });

  it('mid-cold biome at high altitude turns to snow', () => {
    const cool = { baseTemperature: 0.3, hasPrecipitation: true };
    // Y=200 → 0.3 - (200-81)×0.00125 = 0.3 - 0.149 = 0.151 → still rain.
    // Y=210 → 0.3 - (210-81)×0.00125 = 0.3 - 0.16 = 0.14 → snow.
    expect(precipitationAt(cool, 200)).toBe('rain');
    expect(precipitationAt(cool, 210)).toBe('snow');
  });

  it('temperature drops with altitude (wiki: 0.00125/block above Y=81)', () => {
    expect(adjustedTemperature(plains, 128)).toBeLessThan(plains.baseTemperature);
    // Y=181 (100 blocks above Y=81): 0.8 - 100×0.00125 = 0.675.
    expect(adjustedTemperature(plains, 181)).toBeCloseTo(0.675);
    // Y=80 should still equal base.
    expect(adjustedTemperature(plains, 80)).toBe(plains.baseTemperature);
  });

  it('snow accumulation requires sky + cold', () => {
    expect(canAccumulateSnow(frozen, 64, true)).toBe(true);
    expect(canAccumulateSnow(frozen, 64, false)).toBe(false);
    expect(canAccumulateSnow(plains, 64, true)).toBe(false);
  });
});
