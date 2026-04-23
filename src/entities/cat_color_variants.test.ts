import { describe, it, expect } from 'vitest';
import { villageVariant, swampHutAlwaysBlack, allVariants } from './cat_color_variants';

describe('cat color variants', () => {
  it('11 variants', () => {
    expect(allVariants().length).toBe(11);
  });

  it('swamp hut black only', () => {
    expect(swampHutAlwaysBlack()).toBe('black');
  });

  it('village variant in set', () => {
    const v = villageVariant(() => 0.3);
    expect(allVariants()).toContain(v);
  });

  it('different rng different cat', () => {
    const a = villageVariant(() => 0);
    const b = villageVariant(() => 0.95);
    expect(a).not.toBe(b);
  });
});
