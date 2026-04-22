import { describe, it, expect } from 'vitest';
import { oceanVariant, fishFor } from './ocean_temperature';

describe('ocean variants', () => {
  it('warm shallow', () => {
    expect(oceanVariant({ latTemperature: 1, isDeep: false })).toBe('warm');
  });

  it('deep prefix', () => {
    expect(oceanVariant({ latTemperature: 0.1, isDeep: true })).toBe('deep_normal');
  });

  it('cold', () => {
    expect(oceanVariant({ latTemperature: -0.3, isDeep: false })).toBe('cold');
  });

  it('frozen', () => {
    expect(oceanVariant({ latTemperature: -1, isDeep: true })).toBe('deep_frozen');
  });

  it('fish tables', () => {
    expect(fishFor('warm')).toContain('tropical_fish');
    expect(fishFor('deep_cold')).toContain('cod');
    expect(fishFor('frozen')).toEqual(['cod']);
  });
});
