import { describe, it, expect } from 'vitest';
import { variantForBiome } from './wolf_variant_biome';

describe('wolf variant biome', () => {
  it('taiga pale', () => {
    expect(variantForBiome('taiga')).toBe('pale');
  });

  it('snowy taiga ashen (wiki)', () => {
    expect(variantForBiome('snowy_taiga')).toBe('ashen');
  });

  it('forest woods', () => {
    expect(variantForBiome('forest')).toBe('woods');
  });

  it('grove snowy (wiki)', () => {
    expect(variantForBiome('grove')).toBe('snowy');
  });

  it('savanna_plateau spotted (wiki)', () => {
    expect(variantForBiome('savanna_plateau')).toBe('spotted');
  });

  it('unknown default pale', () => {
    expect(variantForBiome('desert')).toBe('pale');
  });
});
