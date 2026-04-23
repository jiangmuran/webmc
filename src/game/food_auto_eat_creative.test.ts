import { describe, it, expect } from 'vitest';
import { canUseFood, losesDurabilityFromSword } from './food_auto_eat_creative';

describe('food auto eat creative', () => {
  it('creative cannot eat', () => {
    expect(canUseFood({ gameMode: 'creative', hunger: 5, maxHunger: 20, foodSaturation: 0 })).toBe(
      false,
    );
  });

  it('survival with hunger eats', () => {
    expect(canUseFood({ gameMode: 'survival', hunger: 5, maxHunger: 20, foodSaturation: 0 })).toBe(
      true,
    );
  });

  it('full hunger no eat', () => {
    expect(canUseFood({ gameMode: 'survival', hunger: 20, maxHunger: 20, foodSaturation: 0 })).toBe(
      false,
    );
  });

  it('durability creative free', () => {
    expect(losesDurabilityFromSword('creative')).toBe(false);
    expect(losesDurabilityFromSword('survival')).toBe(true);
  });
});
