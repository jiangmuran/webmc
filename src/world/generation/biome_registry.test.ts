import { describe, it, expect } from 'vitest';
import { biomeOf, allOfDimension } from './biome_registry';

describe('biome registry', () => {
  it('known biome', () => {
    expect(biomeOf('plains')?.temperature).toBe(0.8);
  });

  it('unknown undefined', () => {
    expect(biomeOf('skyblock')).toBeUndefined();
  });

  it('nether filter', () => {
    const n = allOfDimension('nether');
    expect(n.every((b) => b.dimension === 'nether')).toBe(true);
  });

  it('snowy has subzero temp', () => {
    expect(biomeOf('snowy_plains')?.temperature).toBeLessThan(0);
  });
});
