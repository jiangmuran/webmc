import { describe, it, expect } from 'vitest';
import { biomeForRadius, hasChorusPlants, endCityEligible, END_BIOMES } from './end_biome_registry';

describe('end biome registry', () => {
  it('center = the_end', () => {
    expect(biomeForRadius(100)).toBe('the_end');
  });

  it('large radius = barrens', () => {
    expect(biomeForRadius(20000)).toBe('end_barrens');
  });

  it('chorus outside center', () => {
    expect(hasChorusPlants('the_end')).toBe(false);
    expect(hasChorusPlants('end_highlands')).toBe(true);
  });

  it('end city eligibility', () => {
    expect(endCityEligible('end_highlands')).toBe(true);
    expect(endCityEligible('the_end')).toBe(false);
  });

  it('5 biomes listed', () => {
    expect(END_BIOMES.length).toBe(5);
  });
});
