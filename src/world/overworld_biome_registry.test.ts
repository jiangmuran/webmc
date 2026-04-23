import { describe, it, expect } from 'vitest';
import { byId, byCategory, OVERWORLD_BIOMES } from './overworld_biome_registry';

describe('overworld biome registry', () => {
  it('contains plains', () => {
    expect(byId('plains')).not.toBeNull();
  });

  it('unknown returns null', () => {
    expect(byId('mystery')).toBeNull();
  });

  it('plural categories exist', () => {
    expect(byCategory('lush').length).toBeGreaterThan(0);
    expect(byCategory('ocean').length).toBeGreaterThan(0);
  });

  it('deep dark is cave', () => {
    expect(byId('deep_dark')?.category).toBe('cave');
  });

  it('many biomes registered', () => {
    expect(OVERWORLD_BIOMES.length).toBeGreaterThan(20);
  });
});
