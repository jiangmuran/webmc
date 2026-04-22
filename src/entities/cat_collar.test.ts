import { describe, it, expect } from 'vitest';
import { breedCatVariant, CAT_VARIANTS, dyeCollar, makeCat, rollCatGift } from './cat_collar';

describe('cat collar', () => {
  it('11 variants', () => {
    expect(CAT_VARIANTS.length).toBe(11);
  });

  it('dyeCollar requires tame', () => {
    const c = makeCat(1, 'tabby');
    expect(dyeCollar({ state: c, dye: 'blue' })).toBe(false);
    c.tamed = true;
    expect(dyeCollar({ state: c, dye: 'blue' })).toBe(true);
    expect(c.collarColor).toBe('blue');
  });

  it('breed inherits from a parent', () => {
    const v = breedCatVariant({ parentA: 'tabby', parentB: 'calico', rng: () => 0.3 });
    expect(['tabby', 'calico']).toContain(v);
  });

  it('gift roll returns item', () => {
    expect(rollCatGift(0.01)).toBe('webmc:rabbit_hide');
    expect(rollCatGift(0.99)).toBe('webmc:string');
  });
});
