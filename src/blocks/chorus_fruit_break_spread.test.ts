import { describe, it, expect } from 'vitest';
import { canBranch, breaksCascadesDown, MAX_PLANT_HEIGHT } from './chorus_fruit_break_spread';

describe('chorus break spread', () => {
  it('max height no branch', () => {
    expect(canBranch({ plantHeight: MAX_PLANT_HEIGHT, ageBonus: 0 }, () => 0)).toBe(false);
  });

  it('early branches with lucky roll', () => {
    expect(canBranch({ plantHeight: 0, ageBonus: 0 }, () => 0)).toBe(true);
  });

  it('tall unlucky skips', () => {
    expect(canBranch({ plantHeight: 4, ageBonus: 0 }, () => 0.9)).toBe(false);
  });

  it('cascade flag', () => {
    expect(breaksCascadesDown()).toBe(true);
  });
});
