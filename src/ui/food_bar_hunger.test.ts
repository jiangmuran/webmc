import { describe, it, expect } from 'vitest';
import { iconStates, shakeOnLowFood, MAX_FOOD, ICONS } from './food_bar_hunger';

describe('food bar hunger', () => {
  it('full', () => {
    const s = iconStates({ food: MAX_FOOD, saturation: 5, hungerShake: false });
    expect(s.every((x) => x === 'full')).toBe(true);
  });

  it('empty', () => {
    const s = iconStates({ food: 0, saturation: 0, hungerShake: false });
    expect(s.every((x) => x === 'empty')).toBe(true);
  });

  it('half icon', () => {
    const s = iconStates({ food: 1, saturation: 0, hungerShake: false });
    expect(s[0]).toBe('half');
  });

  it('mixed 5/10', () => {
    const s = iconStates({ food: 10, saturation: 0, hungerShake: false });
    expect(s.slice(0, 5)).toEqual(new Array(5).fill('full'));
    expect(s.slice(5)).toEqual(new Array(5).fill('empty'));
  });

  it('shake when low', () => {
    expect(shakeOnLowFood(3)).toBe(true);
    expect(shakeOnLowFood(10)).toBe(false);
  });

  it('ICONS * 2 = MAX_FOOD', () => {
    expect(ICONS * 2).toBe(MAX_FOOD);
  });
});
