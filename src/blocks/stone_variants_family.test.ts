import { describe, it, expect } from 'vitest';
import { smeltInto, polishedOf, isCobblestone } from './stone_variants_family';

describe('stone variants family', () => {
  it('cobble smelts to stone', () => {
    expect(smeltInto('cobblestone')).toBe('stone');
  });

  it('stone smelts to smooth', () => {
    expect(smeltInto('stone')).toBe('smooth_stone');
  });

  it('polished for granite', () => {
    expect(polishedOf('granite')).toBe('polished_granite');
  });

  it('stone no polish', () => {
    expect(polishedOf('stone')).toBeNull();
  });

  it('isCobblestone recognizes mossy', () => {
    expect(isCobblestone('mossy_cobblestone')).toBe(true);
    expect(isCobblestone('stone')).toBe(false);
  });
});
