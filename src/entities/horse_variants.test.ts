import { describe, it, expect } from 'vitest';
import {
  breedHorseVariant,
  growthReductionOf,
  HORSE_COLORS,
  HORSE_GROW_TICKS,
  HORSE_MARKINGS,
  variantTextureId,
  wildHorseVariant,
} from './horse_variants';

describe('horse variants', () => {
  it('7 colors × 5 markings', () => {
    expect(HORSE_COLORS.length).toBe(7);
    expect(HORSE_MARKINGS.length).toBe(5);
  });

  it('wild variant valid', () => {
    const v = wildHorseVariant(() => 0.5);
    expect(HORSE_COLORS).toContain(v.color);
    expect(HORSE_MARKINGS).toContain(v.marking);
  });

  it('breed inherits traits', () => {
    const a = { color: 'white' as const, marking: 'none' as const };
    const b = { color: 'black' as const, marking: 'paint' as const };
    // High roll to skip mutations → deterministic inheritance.
    let calls = 0;
    const rng = (): number => {
      calls++;
      if (calls <= 2) return 0.9; // mutation skips
      return 0.3; // parentA wins
    };
    const child = breedHorseVariant({ parentA: a, parentB: b, rng });
    expect([a.color, b.color]).toContain(child.color);
  });

  it('texture id composes', () => {
    expect(variantTextureId({ color: 'white', marking: 'paint' })).toBe('webmc:horse_white_paint');
  });

  it('grow ticks', () => {
    expect(HORSE_GROW_TICKS).toBe(24000);
  });

  it('food accelerates', () => {
    expect(growthReductionOf('webmc:golden_apple')).toBeLessThan(0);
    expect(growthReductionOf('webmc:stone')).toBe(0);
  });
});
