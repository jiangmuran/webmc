import { describe, it, expect } from 'vitest';
import {
  xpForLevel,
  totalXpForLevel,
  progressFraction,
  greenTintLevelAtLeast,
} from './xp_bar_progress';

describe('xp bar progress', () => {
  it('level 0 needs 7', () => {
    expect(xpForLevel(0)).toBe(7);
  });

  it('level 16 needs more', () => {
    expect(xpForLevel(16)).toBeGreaterThan(xpForLevel(15));
  });

  it('level 31 upper tier', () => {
    expect(xpForLevel(31)).toBeGreaterThan(xpForLevel(30));
  });

  it('total cumulative', () => {
    expect(totalXpForLevel(2)).toBe(xpForLevel(0) + xpForLevel(1));
  });

  it('progress bounded', () => {
    expect(progressFraction(10, 0)).toBeGreaterThan(0);
    expect(progressFraction(0, 0)).toBe(0);
  });

  it('progress clamped', () => {
    expect(progressFraction(9999, 0)).toBe(1);
  });

  it('green tint at level 30', () => {
    expect(greenTintLevelAtLeast(30)).toBe(true);
    expect(greenTintLevelAtLeast(29)).toBe(false);
  });
});
