import { describe, it, expect } from 'vitest';
import { PAINTING_VARIANTS, pickPainting } from './painting';

describe('painting', () => {
  it('has 47 variants per wiki (1.21+ canonical set)', () => {
    // Wiki (minecraft.wiki/w/Painting): "There are 47 paintings in
    // the game." Excludes the 4 command-only elemental paintings
    // (earth/wind/fire/water) which are not rollable. Old code had
    // 28 entries with a non-existent 'sun' motif and the
    // command-only 'earth' wrongly in the random pool.
    expect(PAINTING_VARIANTS.length).toBe(47);
    expect(PAINTING_VARIANTS.find((v) => v.key === 'sun')).toBeUndefined();
    expect(PAINTING_VARIANTS.find((v) => v.key === 'earth')).toBeUndefined();
  });

  it('small wall → only 1x1 paintings', () => {
    const p = pickPainting({ widthAvailable: 1, heightAvailable: 1, rng: () => 0 });
    expect(p?.width).toBe(1);
    expect(p?.height).toBe(1);
  });

  it('no-room → null', () => {
    const p = pickPainting({ widthAvailable: 0, heightAvailable: 0, rng: () => 0 });
    expect(p).toBeNull();
  });

  it('huge wall fits every painting (random in full range)', () => {
    const p = pickPainting({ widthAvailable: 4, heightAvailable: 4, rng: () => 0.9 });
    expect(p).not.toBeNull();
  });
});
