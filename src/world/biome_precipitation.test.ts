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

  it('high altitude plains becomes snow', () => {
    expect(precipitationAt(plains, 500)).toBe('snow');
  });

  it('temperature drops with altitude', () => {
    expect(adjustedTemperature(plains, 128)).toBeLessThan(plains.baseTemperature);
  });

  it('snow accumulation requires sky + cold', () => {
    expect(canAccumulateSnow(frozen, 64, true)).toBe(true);
    expect(canAccumulateSnow(frozen, 64, false)).toBe(false);
    expect(canAccumulateSnow(plains, 64, true)).toBe(false);
  });
});
