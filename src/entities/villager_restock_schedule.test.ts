import { describe, it, expect } from 'vitest';
import { currentActivity, tryRestock, MAX_RESTOCKS_PER_DAY } from './villager_restock_schedule';

describe('villager schedule', () => {
  it('sleeps at night', () => {
    expect(currentActivity(15000, false)).toBe('sleep');
  });

  it('works in morning', () => {
    expect(currentActivity(3000, false)).toBe('work');
  });

  it('child plays', () => {
    expect(currentActivity(5000, true)).toBe('play');
  });
});

describe('restock', () => {
  it('limits per day', () => {
    const s = { restocksToday: 0, lastDayIndex: 0 };
    expect(tryRestock(s, 3000)).toBe(true);
    expect(tryRestock(s, 4000)).toBe(true);
    expect(tryRestock(s, 5000)).toBe(false);
    expect(s.restocksToday).toBe(MAX_RESTOCKS_PER_DAY);
  });

  it('resets next day', () => {
    const s = { restocksToday: 2, lastDayIndex: 0 };
    expect(tryRestock(s, 24000 + 3000)).toBe(true);
    expect(s.restocksToday).toBe(1);
  });

  it('only during work', () => {
    const s = { restocksToday: 0, lastDayIndex: 0 };
    expect(tryRestock(s, 15000)).toBe(false);
  });
});
