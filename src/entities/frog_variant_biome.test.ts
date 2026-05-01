import { describe, it, expect } from 'vitest';
import { frogVariantForTemperature, froglightColorFor } from './frog_variant_biome';

describe('frog variant by biome', () => {
  it('cold biome cold variant', () => {
    expect(frogVariantForTemperature(0.1)).toBe('cold');
  });

  it('desert biome warm variant', () => {
    expect(frogVariantForTemperature(2)).toBe('warm');
  });

  it('plains biome temperate', () => {
    expect(frogVariantForTemperature(0.8)).toBe('temperate');
  });

  it('warm → pearlescent (wiki Froglight#Acquisition)', () => {
    expect(froglightColorFor('warm', 'small_magma_cube')).toBe('pearlescent_froglight');
  });

  it('cold → verdant (wiki Froglight#Acquisition)', () => {
    expect(froglightColorFor('cold', 'small_magma_cube')).toBe('verdant_froglight');
  });

  it('temperate → ochre (wiki Froglight#Acquisition)', () => {
    expect(froglightColorFor('temperate', 'small_magma_cube')).toBe('ochre_froglight');
  });
});
