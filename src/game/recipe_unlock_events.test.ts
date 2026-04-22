import { describe, it, expect } from 'vitest';
import { unlocksFromItem, RecipeBookState } from './recipe_unlock_events';

describe('recipe unlock', () => {
  it('log unlocks planks', () => {
    expect(unlocksFromItem('webmc:oak_log')).toContain('planks');
  });

  it('unknown = empty', () => {
    expect(unlocksFromItem('webmc:bedrock')).toEqual([]);
  });

  it('pickup unlocks only once', () => {
    const b = new RecipeBookState();
    const first = b.pickup('webmc:oak_log');
    expect(first).toEqual(['planks']);
    const second = b.pickup('webmc:oak_log');
    expect(second).toEqual([]);
  });

  it('tracks set', () => {
    const b = new RecipeBookState();
    b.pickup('webmc:cobblestone');
    expect(b.isUnlocked('stone_pickaxe')).toBe(true);
    expect(b.size).toBeGreaterThan(0);
  });
});
