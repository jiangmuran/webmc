import { describe, it, expect } from 'vitest';
import { canSmeltTool, nuggetYield, xpPerSmelt } from './smelt_damaged_tool';

describe('smelt damaged tool', () => {
  it('iron sword → iron nugget', () => {
    expect(nuggetYield({ id: 'iron_sword', damagePct: 0.5 })).toBe('iron_nugget');
  });

  it('gold pickaxe → gold nugget', () => {
    expect(nuggetYield({ id: 'gold_pickaxe', damagePct: 0.1 })).toBe('gold_nugget');
  });

  it('chain boots iron nugget', () => {
    expect(nuggetYield({ id: 'chainmail_boots', damagePct: 0 })).toBe('iron_nugget');
  });

  it('netherite refused', () => {
    expect(canSmeltTool({ id: 'netherite_sword', damagePct: 0.5 })).toBe(false);
  });

  it('stone tool refused', () => {
    expect(canSmeltTool({ id: 'stone_pickaxe', damagePct: 0 })).toBe(false);
  });

  it('xp per smelt', () => {
    expect(xpPerSmelt()).toBeGreaterThan(0);
  });
});
