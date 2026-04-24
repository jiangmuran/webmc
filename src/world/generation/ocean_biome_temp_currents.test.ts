import { describe, it, expect } from 'vitest';
import {
  iceCoverFor,
  surfaceFluidBlock,
  fishSpecies,
  undergroundCurrentStrength,
} from './ocean_biome_temp_currents';

describe('ocean biome temp currents', () => {
  it('frozen ocean has ice', () => {
    expect(iceCoverFor('frozen')).toBe(true);
  });

  it('warm ocean no ice', () => {
    expect(iceCoverFor('warm')).toBe(false);
  });

  it('frozen surface ice block', () => {
    expect(surfaceFluidBlock('frozen')).toBe('ice');
  });

  it('others water', () => {
    expect(surfaceFluidBlock('warm')).toBe('water');
  });

  it('warm has tropical fish', () => {
    expect(fishSpecies('warm')).toContain('tropical_fish');
  });

  it('cold has cod', () => {
    expect(fishSpecies('cold')).toContain('cod');
  });

  it('frozen no fish', () => {
    expect(fishSpecies('frozen')).toEqual([]);
  });

  it('deep current stronger', () => {
    expect(undergroundCurrentStrength({ temp: 'warm', depth: 'deep' })).toBeGreaterThan(
      undergroundCurrentStrength({ temp: 'warm', depth: 'shallow' }),
    );
  });
});
