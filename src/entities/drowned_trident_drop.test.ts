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
  it('flat 6.25% trident chance regardless of difficulty (wiki)', () => {
    expect(holdsTridentChance('easy')).toBeCloseTo(0.0625);
    expect(holdsTridentChance('normal')).toBeCloseTo(0.0625);
    expect(holdsTridentChance('hard')).toBeCloseTo(0.0625);
  });

  it('spawn roll under 6.25% triggers trident', () => {
    expect(shouldSpawnWithTrident({ difficulty: 'hard', rand: () => 0.05 })).toBe(true);
    expect(shouldSpawnWithTrident({ difficulty: 'hard', rand: () => 0.1 })).toBe(false);
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
