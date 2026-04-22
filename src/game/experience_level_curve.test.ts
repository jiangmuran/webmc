import { describe, it, expect } from 'vitest';
import {
  xpToNextLevel,
  totalXpForLevel,
  levelFromTotalXp,
  xpBarFraction,
} from './experience_level_curve';

describe('xp curve', () => {
  it('level 0 needs 7', () => {
    expect(xpToNextLevel(0)).toBe(7);
  });

  it('level 16 bump to 42', () => {
    expect(xpToNextLevel(16)).toBe(5 * 16 - 38);
  });

  it('level 31 bump to 133', () => {
    expect(xpToNextLevel(31)).toBe(9 * 31 - 158);
  });

  it('total grows', () => {
    expect(totalXpForLevel(5)).toBeGreaterThan(totalXpForLevel(3));
  });

  it('levelFromTotal round-trip', () => {
    const L = 10;
    const { level, remainder } = levelFromTotalXp(totalXpForLevel(L));
    expect(level).toBe(L);
    expect(remainder).toBe(0);
  });

  it('bar fraction', () => {
    expect(xpBarFraction(0, 0)).toBe(0);
    expect(xpBarFraction(7, 0)).toBe(1);
    expect(xpBarFraction(3, 0)).toBeCloseTo(3 / 7);
  });
});
