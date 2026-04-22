import { describe, it, expect } from 'vitest';
import { resolveRecipe, type Recipe } from './inventory_craft_3x3';

const plankRecipe: Recipe = {
  kind: 'shapeless',
  id: 'planks',
  ingredients: ['webmc:oak_log'],
  output: { id: 'webmc:oak_planks', count: 4 },
};

const pickRecipe: Recipe = {
  kind: 'shaped',
  id: 'wooden_pickaxe',
  pattern: ['PPP', ' S ', ' S '],
  key: { P: 'webmc:oak_planks', S: 'webmc:stick' },
  output: { id: 'webmc:wooden_pickaxe', count: 1 },
};

describe('3x3 recipe', () => {
  it('shapeless matches', () => {
    const grid: (string | null)[] = [
      null,
      null,
      null,
      'webmc:oak_log',
      null,
      null,
      null,
      null,
      null,
    ];
    expect(resolveRecipe({ grid, recipes: [plankRecipe] })?.id).toBe('planks');
  });

  it('shaped pickaxe matches', () => {
    const grid: (string | null)[] = [
      'webmc:oak_planks',
      'webmc:oak_planks',
      'webmc:oak_planks',
      null,
      'webmc:stick',
      null,
      null,
      'webmc:stick',
      null,
    ];
    expect(resolveRecipe({ grid, recipes: [pickRecipe] })?.id).toBe('wooden_pickaxe');
  });

  it('mismatch returns null', () => {
    const grid: (string | null)[] = [null, null, null, null, null, null, null, null, null];
    expect(resolveRecipe({ grid, recipes: [plankRecipe] })).toBeNull();
  });

  it('wrong shape fails', () => {
    const grid: (string | null)[] = [
      'webmc:oak_planks',
      null,
      'webmc:oak_planks',
      null,
      'webmc:stick',
      null,
      null,
      'webmc:stick',
      null,
    ];
    expect(resolveRecipe({ grid, recipes: [pickRecipe] })).toBeNull();
  });
});
