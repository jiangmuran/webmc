import { describe, it, expect } from 'vitest';
import { PAINTING_VARIANTS, pickPainting } from './painting';

describe('painting', () => {
  it('has 28 variants', () => {
    expect(PAINTING_VARIANTS.length).toBe(28);
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
