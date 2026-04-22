import { describe, it, expect } from 'vitest';
import { isTuff, stonecutterRecipe, TUFF_HARDNESS } from './tuff_variants';

describe('tuff variants', () => {
  it('identifies tuff family', () => {
    expect(isTuff('tuff')).toBe(true);
    expect(isTuff('polished_tuff_slab')).toBe(true);
    expect(isTuff('tuff_brick_wall')).toBe(true);
    expect(isTuff('stone')).toBe(false);
  });

  it('stonecutter from tuff sources', () => {
    expect(stonecutterRecipe('tuff', 'tuff_bricks')).toBe(true);
    expect(stonecutterRecipe('tuff_bricks', 'tuff_brick_wall')).toBe(true);
  });

  it('stonecutter rejects non-source', () => {
    expect(stonecutterRecipe('chiseled_tuff', 'tuff_bricks')).toBe(false);
  });

  it('hardness', () => {
    expect(TUFF_HARDNESS).toBe(1.5);
  });
});
