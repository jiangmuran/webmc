import { describe, it, expect } from 'vitest';
import {
  isBreedFood,
  feedResetsLoveCooldownTicks,
  babyTypeInheritsParent,
} from './rabbit_breed_food';

describe('rabbit breed food', () => {
  it('carrot is food', () => {
    expect(isBreedFood('carrot')).toBe(true);
  });

  it('stick not', () => {
    expect(isBreedFood('stick')).toBe(false);
  });

  it('love cooldown positive', () => {
    expect(feedResetsLoveCooldownTicks()).toBeGreaterThan(0);
  });

  it('baby inherits one parent', () => {
    const baby = babyTypeInheritsParent('brown', 'white', () => 0);
    expect(['brown', 'white']).toContain(baby);
  });

  it('matching parents yields same', () => {
    expect(babyTypeInheritsParent('black', 'black', () => 0.1)).toBe('black');
  });
});
