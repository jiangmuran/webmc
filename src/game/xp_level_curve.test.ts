import { describe, it, expect } from 'vitest';
import {
  xpToNext,
  cumulativeXpForLevel,
  levelFromCumulativeXp,
  progressInLevel,
} from './xp_level_curve';

describe('xp level curve', () => {
  it('level 0 → 1 needs 7', () => {
    expect(xpToNext(0)).toBe(7);
  });

  it('level 15 → 16 needs 37', () => {
    expect(xpToNext(15)).toBe(37);
  });

  it('level 30 → 31 needs 112', () => {
    expect(xpToNext(30)).toBe(112);
  });

  it('level 31 uses high curve', () => {
    expect(xpToNext(31)).toBe(9 * 31 - 158);
  });

  it('cumulative at 1 = 7', () => {
    expect(cumulativeXpForLevel(1)).toBe(7);
  });

  it('level from cumulative', () => {
    expect(levelFromCumulativeXp(0)).toBe(0);
    expect(levelFromCumulativeXp(7)).toBe(1);
    expect(levelFromCumulativeXp(100000)).toBeGreaterThan(30);
  });

  it('progress 0..1', () => {
    const p = progressInLevel(10);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThan(1);
  });
});
