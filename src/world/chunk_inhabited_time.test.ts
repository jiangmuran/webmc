import { describe, it, expect } from 'vitest';
import { accrue, localDifficulty, enchantArmorChance } from './chunk_inhabited_time';

describe('chunk inhabited time', () => {
  it('no accrue when empty', () => {
    expect(accrue({ inhabitedTicks: 100 }, 0).inhabitedTicks).toBe(100);
  });

  it('accrues with player', () => {
    expect(accrue({ inhabitedTicks: 100 }, 1).inhabitedTicks).toBe(101);
  });

  it('local diff base 0', () => {
    expect(localDifficulty({ inhabitedTicks: 0 }, 0)).toBeCloseTo(0);
  });

  it('local diff ramps with time', () => {
    const high = localDifficulty({ inhabitedTicks: 150 * 3600 * 20 }, 0);
    expect(high).toBeGreaterThan(3);
  });

  it('diff capped 6.75', () => {
    expect(localDifficulty({ inhabitedTicks: 1e12 }, 6)).toBeLessThanOrEqual(6.75);
  });

  it('enchant chance 0 at low diff', () => {
    expect(enchantArmorChance(1)).toBe(0);
  });

  it('enchant chance rises', () => {
    expect(enchantArmorChance(5)).toBeCloseTo(0.3);
  });
});
