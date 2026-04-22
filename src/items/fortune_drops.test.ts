import { describe, it, expect } from 'vitest';
import { oreDrops, cropBonusDrops, supports, FORTUNE_MAX_LEVEL } from './fortune_drops';

describe('fortune drops', () => {
  it('level 0 yields 1', () => {
    expect(oreDrops(0, () => 0.5)).toBe(1);
  });

  it('always at least 1', () => {
    for (let i = 0; i < 100; i++) {
      expect(oreDrops(3, Math.random)).toBeGreaterThanOrEqual(1);
    }
  });

  it('crop bonus bounded by level', () => {
    for (let i = 0; i < 100; i++) {
      const b = cropBonusDrops(FORTUNE_MAX_LEVEL, Math.random);
      expect(b).toBeLessThanOrEqual(FORTUNE_MAX_LEVEL);
    }
  });

  it('no crop bonus at 0', () => {
    expect(cropBonusDrops(0, () => 0)).toBe(0);
  });

  it('supports pickaxe', () => {
    expect(supports('pickaxe')).toBe(true);
    expect(supports('sword')).toBe(false);
  });
});
