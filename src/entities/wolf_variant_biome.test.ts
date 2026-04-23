import { describe, it, expect } from 'vitest';
import { variantForBiome } from './wolf_variant_biome';

describe('wolf variant biome', () => {
  it('taiga pale', () => {
    expect(variantForBiome('taiga')).toBe('pale');
  });

  it('snowy taiga snowy', () => {
    expect(variantForBiome('snowy_taiga')).toBe('snowy');
  });

  it('forest woods', () => {
    expect(variantForBiome('forest')).toBe('woods');
  });

  it('unknown default', () => {
    expect(variantForBiome('desert')).toBe('woods');
  });
});
