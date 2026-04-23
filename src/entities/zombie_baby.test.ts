import { describe, it, expect } from 'vitest';
import {
  movementSpeedMultiplier,
  spawnChance,
  grownUp,
  canRideChicken,
  GROW_UP_TICKS,
} from './zombie_baby';

describe('zombie baby', () => {
  it('faster than adult', () => {
    expect(movementSpeedMultiplier()).toBeGreaterThan(1);
  });

  it('rare spawn', () => {
    expect(spawnChance()).toBeLessThan(0.1);
  });

  it('grows up after threshold', () => {
    expect(grownUp({ ageTicks: GROW_UP_TICKS, chickenJockey: false })).toBe(true);
    expect(grownUp({ ageTicks: 0, chickenJockey: false })).toBe(false);
  });

  it('baby can ride chicken', () => {
    expect(canRideChicken({ ageTicks: 0, chickenJockey: false })).toBe(true);
    expect(canRideChicken({ ageTicks: GROW_UP_TICKS, chickenJockey: false })).toBe(false);
  });
});
