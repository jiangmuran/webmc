import { describe, it, expect } from 'vitest';
import { baseLevel, canAfford, enchantPower, SLOT_LEVEL_COST } from './enchant_table_rolls';

describe('enchant table rolls', () => {
  it('max bookshelves = max level slot 2 >= 30', () => {
    const lvl = baseLevel({ shelfCount: 15, rng: () => 0.99, slot: 2 });
    expect(lvl).toBeGreaterThanOrEqual(30);
  });

  it('zero shelves = lower max', () => {
    const lvl = baseLevel({ shelfCount: 0, rng: () => 0.99, slot: 2 });
    expect(lvl).toBeLessThan(15);
  });

  it('slot 0 < slot 2', () => {
    const a = baseLevel({ shelfCount: 8, rng: () => 0.5, slot: 0 });
    const c = baseLevel({ shelfCount: 8, rng: () => 0.5, slot: 2 });
    expect(a).toBeLessThan(c);
  });

  it('power wraps within ±15%', () => {
    const p = enchantPower(20, () => 0.5);
    expect(p).toBeGreaterThanOrEqual(17);
    expect(p).toBeLessThanOrEqual(23);
  });

  it('costs 1/2/3', () => {
    expect(SLOT_LEVEL_COST).toEqual([1, 2, 3]);
  });

  it('canAfford checks both thresholds', () => {
    expect(canAfford(10, 2, 5)).toBe(true);
    expect(canAfford(2, 2, 5)).toBe(false);
    expect(canAfford(2, 0, 1)).toBe(true);
  });
});
