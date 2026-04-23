import { describe, it, expect } from 'vitest';
import { matches, type ShapedRecipe } from './recipe_shaped_match';

const pickaxe: ShapedRecipe = {
  id: 'wooden_pickaxe',
  pattern: ['PPP', ' S ', ' S '],
  key: { P: 'oak_planks', S: 'stick' },
  result: { id: 'wooden_pickaxe', count: 1 },
};

describe('shaped recipe match', () => {
  it('centered 3x3 matches', () => {
    const grid: string[][] = [
      ['oak_planks', 'oak_planks', 'oak_planks'],
      ['air', 'stick', 'air'],
      ['air', 'stick', 'air'],
    ];
    expect(matches(pickaxe, grid)).toBe(true);
  });

  it('missing stick fails', () => {
    const grid: string[][] = [
      ['oak_planks', 'oak_planks', 'oak_planks'],
      ['air', 'air', 'air'],
      ['air', 'stick', 'air'],
    ];
    expect(matches(pickaxe, grid)).toBe(false);
  });

  it('extra item fails', () => {
    const grid: string[][] = [
      ['oak_planks', 'oak_planks', 'oak_planks'],
      ['stone', 'stick', 'air'],
      ['air', 'stick', 'air'],
    ];
    expect(matches(pickaxe, grid)).toBe(false);
  });

  it('offset in 3x3', () => {
    const small: ShapedRecipe = {
      id: 'torch',
      pattern: ['C', 'S'],
      key: { C: 'coal', S: 'stick' },
      result: { id: 'torch', count: 4 },
    };
    const grid: string[][] = [
      ['air', 'air', 'air'],
      ['coal', 'air', 'air'],
      ['stick', 'air', 'air'],
    ];
    expect(matches(small, grid)).toBe(true);
  });
});
