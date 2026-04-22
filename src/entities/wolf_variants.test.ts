import { describe, it, expect } from 'vitest';
import { WOLF_VARIANTS, wolfVariantFor } from './wolf_variants';

describe('wolf variants', () => {
  it('has 9 variants', () => {
    expect(Object.keys(WOLF_VARIANTS).length).toBe(9);
  });

  it('picks correct variant for each biome', () => {
    expect(wolfVariantFor('snowy_taiga')).toBe('ashen');
    expect(wolfVariantFor('sparse_jungle')).toBe('rusty');
    expect(wolfVariantFor('wooded_badlands')).toBe('striped');
  });

  it('defaults to woods for unknown biome', () => {
    expect(wolfVariantFor('nether_wastes')).toBe('woods');
  });
});
