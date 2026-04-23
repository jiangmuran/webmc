import { describe, it, expect } from 'vitest';
import { recipesFor, yieldCount, canCut } from './stonecutter_recipe';

describe('stonecutter recipe', () => {
  it('stone has many outputs', () => {
    expect(recipesFor('stone').length).toBeGreaterThan(1);
  });

  it('unknown empty', () => {
    expect(recipesFor('mystery')).toEqual([]);
  });

  it('slab yields 2', () => {
    expect(yieldCount('stone_slab')).toBe(2);
  });

  it('stairs yield 1', () => {
    expect(yieldCount('stone_stairs')).toBe(1);
  });

  it('canCut validates pair', () => {
    expect(canCut('stone', 'stone_stairs')).toBe(true);
    expect(canCut('stone', 'oak_stairs')).toBe(false);
  });
});
