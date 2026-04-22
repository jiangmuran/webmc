import { describe, it, expect } from 'vitest';
import { variantForBiome, breedChildVariant } from './wolf_variant';

describe('wolf variant', () => {
  it('taiga → pale', () => {
    expect(variantForBiome('taiga')).toBe('pale');
  });

  it('forest → woods', () => {
    expect(variantForBiome('forest')).toBe('woods');
  });

  it('savanna → spotted', () => {
    expect(variantForBiome('savanna')).toBe('spotted');
  });

  it('unknown biome fallback pale', () => {
    expect(variantForBiome('nether_wastes')).toBe('pale');
  });

  it('breed child one of valid set', () => {
    const valid = new Set(['pale', 'woods', 'ashen']);
    const c = breedChildVariant('woods', 'ashen', 'taiga');
    expect(valid.has(c) || c === 'pale').toBe(true);
  });
});
