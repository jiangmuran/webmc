import { describe, it, expect } from 'vitest';
import { shouldGrowFruit, growthChance, detachedOnFruitBreak, MAX_AGE } from './melon_pumpkin_stem';

describe('melon/pumpkin stem', () => {
  it('mature stem grows fruit', () => {
    expect(shouldGrowFruit({ age: MAX_AGE, hasFruit: false, adjacentFarmland: 1 })).toBe(true);
  });

  it('has fruit already → no new fruit', () => {
    expect(shouldGrowFruit({ age: MAX_AGE, hasFruit: true, adjacentFarmland: 1 })).toBe(false);
  });

  it('no farmland no fruit', () => {
    expect(shouldGrowFruit({ age: MAX_AGE, hasFruit: false, adjacentFarmland: 0 })).toBe(false);
  });

  it('growth chance positive with farmland', () => {
    expect(growthChance({ age: 0, hasFruit: false, adjacentFarmland: 1 })).toBeGreaterThan(0);
    expect(growthChance({ age: 0, hasFruit: false, adjacentFarmland: 0 })).toBe(0);
  });

  it('breaking fruit detaches stem', () => {
    expect(detachedOnFruitBreak()).toBe(true);
  });
});
