import { describe, it, expect } from 'vitest';
import { pickPotion, tickDrink, type WitchContext } from './witch_potion_drink';

const calm: WitchContext = {
  healthFraction: 1,
  onFire: false,
  inWater: false,
  underAttack: false,
};

describe('witch potion drink', () => {
  it('calm does nothing', () => {
    expect(pickPotion(calm)).toBeUndefined();
  });

  it('fire prioritized', () => {
    expect(pickPotion({ ...calm, onFire: true, inWater: true })).toBe('fire_resistance');
  });

  it('water breathing underwater', () => {
    expect(pickPotion({ ...calm, inWater: true })).toBe('water_breathing');
  });

  it('heal at low HP', () => {
    expect(pickPotion({ ...calm, healthFraction: 0.3 })).toBe('heal');
  });

  it('speed under attack', () => {
    expect(pickPotion({ ...calm, underAttack: true })).toBe('speed');
  });

  it('tick reaches zero', () => {
    expect(tickDrink(1)).toEqual({ done: true, remaining: 0 });
  });

  it('tick decrements', () => {
    expect(tickDrink(10)).toEqual({ done: false, remaining: 9 });
  });
});
