import { describe, it, expect } from 'vitest';
import { drinkMilk, countCleared, cooldownTicks } from './milk_clears_effects';

describe('milk clears effects', () => {
  const withEffects = {
    active: [
      { id: 'poison', durationTicks: 100, amplifier: 0 },
      { id: 'weakness', durationTicks: 200, amplifier: 1 },
    ],
  };

  it('clears all', () => {
    expect(drinkMilk(withEffects).active).toEqual([]);
  });

  it('count before clear', () => {
    expect(countCleared(withEffects)).toBe(2);
  });

  it('no cooldown', () => {
    expect(cooldownTicks()).toBe(0);
  });
});
