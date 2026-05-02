import { describe, it, expect } from 'vitest';
import { craftingYield, stonecutterProduces } from './end_stone_brick_variants';

describe('end stone brick variants', () => {
  it('bricks yield 4', () => {
    expect(craftingYield('end_stone_bricks')).toBe(4);
  });

  it('slab yield 6', () => {
    expect(craftingYield('end_stone_brick_slab')).toBe(6);
  });

  it('stonecutter end stone → bricks', () => {
    expect(stonecutterProduces('end_stone', 'end_stone_bricks')).toBe(true);
  });

  it('stonecutter bricks → stairs', () => {
    expect(stonecutterProduces('end_stone_bricks', 'end_stone_brick_stairs')).toBe(true);
  });

  it('stonecutter end stone → all brick variants in one step (wiki)', () => {
    // Wiki: end stone can be stonecut directly to bricks, brick
    // stairs, brick slabs, or brick walls — no intermediate cut.
    expect(stonecutterProduces('end_stone', 'end_stone_brick_stairs')).toBe(true);
    expect(stonecutterProduces('end_stone', 'end_stone_brick_slab')).toBe(true);
    expect(stonecutterProduces('end_stone', 'end_stone_brick_wall')).toBe(true);
  });

  it('no reverse', () => {
    expect(stonecutterProduces('end_stone_bricks', 'end_stone')).toBe(false);
  });
});
