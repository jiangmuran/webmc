import { describe, it, expect } from 'vitest';
import { variantForBiome, breedChildVariant } from './wolf_variant';

describe('wolf variant', () => {
  it('taiga → pale', () => {
    expect(variantForBiome('taiga')).toBe('pale');
  });

  it('forest → woods', () => {
    expect(variantForBiome('forest')).toBe('woods');
  });

  it('savanna_plateau → spotted (wiki)', () => {
    expect(variantForBiome('savanna_plateau')).toBe('spotted');
  });

  it('sparse_jungle → rusty (wiki)', () => {
    expect(variantForBiome('sparse_jungle')).toBe('rusty');
  });

  it('grove → snowy (wiki)', () => {
    expect(variantForBiome('grove')).toBe('snowy');
  });

  it('snowy_taiga → ashen (wiki)', () => {
    expect(variantForBiome('snowy_taiga')).toBe('ashen');
  });

  it('wooded_badlands → striped (wiki)', () => {
    expect(variantForBiome('wooded_badlands')).toBe('striped');
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
