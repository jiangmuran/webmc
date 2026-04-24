import { describe, it, expect } from 'vitest';
import { recipesFor, cut } from './stonecutter_recipe_pick';

describe('stonecutter recipe pick', () => {
  it('stone has slab + stairs', () => {
    const r = recipesFor('stone').map((x) => x.output);
    expect(r).toContain('stone_slab');
    expect(r).toContain('stone_stairs');
  });

  it('dirt has nothing', () => {
    expect(recipesFor('dirt')).toEqual([]);
  });

  it('cut 4 stone → 8 slabs', () => {
    expect(cut('stone', 'stone_slab', 4)).toEqual({ output: 'stone_slab', count: 8 });
  });

  it('unknown recipe', () => {
    expect(cut('stone', 'diamond_sword', 1)).toBeUndefined();
  });

  it('stairs 1:1', () => {
    expect(cut('stone', 'stone_stairs', 3)?.count).toBe(3);
  });
});
