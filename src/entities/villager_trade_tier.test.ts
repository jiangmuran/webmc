import { describe, it, expect } from 'vitest';
import { tierForXp, nextThreshold, unlockedTrades } from './villager_trade_tier';

describe('villager trade tier', () => {
  it('novice at 0', () => {
    expect(tierForXp(0)).toBe('novice');
  });

  it('apprentice at 10', () => {
    expect(tierForXp(10)).toBe('apprentice');
  });

  it('master at 250', () => {
    expect(tierForXp(300)).toBe('master');
  });

  it('next threshold', () => {
    expect(nextThreshold(0)).toBe(10);
    expect(nextThreshold(100)).toBe(150);
    expect(nextThreshold(300)).toBeNull();
  });

  it('trades unlocked', () => {
    expect(unlockedTrades('novice')).toBe(2);
    expect(unlockedTrades('master')).toBe(10);
  });
});
