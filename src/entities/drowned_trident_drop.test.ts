import { describe, it, expect } from 'vitest';
import {
  holdsTridentChance,
  shouldSpawnWithTrident,
  tridentDropChance,
  shouldThrowTrident,
  TRIDENT_DROP_CAP,
  RANGED_MIN_DISTANCE,
  RANGED_MAX_DISTANCE,
} from './drowned_trident_drop';

describe('drowned trident', () => {
  it('difficulty scales', () => {
    expect(holdsTridentChance('hard')).toBeGreaterThan(holdsTridentChance('easy'));
  });

  it('spawn roll', () => {
    expect(shouldSpawnWithTrident({ difficulty: 'hard', rand: () => 0.1 })).toBe(true);
  });

  it('drop with looting capped', () => {
    expect(tridentDropChance(0)).toBeCloseTo(0.085);
    expect(tridentDropChance(10)).toBe(TRIDENT_DROP_CAP);
  });

  it('throw range', () => {
    expect(shouldThrowTrident(RANGED_MIN_DISTANCE - 1)).toBe(false);
    expect(shouldThrowTrident(RANGED_MAX_DISTANCE + 1)).toBe(false);
    expect(shouldThrowTrident(10)).toBe(true);
  });
});
