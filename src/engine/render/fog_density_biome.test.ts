import { describe, it, expect } from 'vitest';
import { densityFor, visibilityRange } from './fog_density_biome';

describe('fog density biome', () => {
  it('nether thicker than clear', () => {
    expect(densityFor('nether_thick')).toBeGreaterThan(densityFor('clear'));
  });

  it('visibility inverse to density', () => {
    expect(visibilityRange('clear')).toBeGreaterThan(visibilityRange('underwater_blue'));
  });

  it('visibility positive', () => {
    expect(visibilityRange('rain')).toBeGreaterThan(0);
  });
});
