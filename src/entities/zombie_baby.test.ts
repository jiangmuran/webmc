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

  it('NEVER grows up (wiki: undead babies stay babies indefinitely)', () => {
    expect(grownUp({ ageTicks: 0, chickenJockey: false })).toBe(false);
    expect(grownUp({ ageTicks: 1_000_000_000, chickenJockey: false })).toBe(false);
    expect(GROW_UP_TICKS).toBe(Number.POSITIVE_INFINITY);
  });

  it('baby can always ride chicken (since baby never grows up)', () => {
    expect(canRideChicken({ ageTicks: 0, chickenJockey: false })).toBe(true);
    expect(canRideChicken({ ageTicks: 1_000_000_000, chickenJockey: false })).toBe(true);
  });
});
