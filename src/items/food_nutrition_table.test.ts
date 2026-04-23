import { describe, it, expect } from 'vitest';
import { foodValues, canEat } from './food_nutrition_table';

describe('food nutrition table', () => {
  it('bread known', () => {
    expect(foodValues('bread')?.hunger).toBe(5);
  });

  it('unknown undefined', () => {
    expect(foodValues('diamond')).toBeUndefined();
  });

  it('cannot eat when full', () => {
    expect(canEat('bread', 20, 20)).toBe(false);
  });

  it('golden apple always edible', () => {
    expect(canEat('golden_apple', 20, 20)).toBe(true);
  });

  it('can eat when hungry', () => {
    expect(canEat('cookie', 10, 20)).toBe(true);
  });

  it('chorus fruit always edible', () => {
    expect(canEat('chorus_fruit', 20, 20)).toBe(true);
  });
});
