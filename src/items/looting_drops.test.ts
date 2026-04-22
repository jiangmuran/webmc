import { describe, it, expect } from 'vitest';
import {
  commonDropBonus,
  rareDropChance,
  effectiveLevel,
  LOOTING_MAX_LEVEL,
} from './looting_drops';

describe('looting drops', () => {
  it('no level no bonus', () => {
    expect(commonDropBonus(0, () => 0.5)).toBe(0);
  });

  it('bonus bounded by level', () => {
    for (let i = 0; i < 100; i++) {
      const b = commonDropBonus(3, Math.random);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(3);
    }
  });

  it('rare boost 1% per level', () => {
    expect(rareDropChance(0.1, 3)).toBeCloseTo(0.13);
  });

  it('effective zero without sword', () => {
    expect(effectiveLevel({ killerHeldEnchantedSword: false, lootingLevel: 3 })).toBe(0);
  });

  it('clamps at max', () => {
    expect(effectiveLevel({ killerHeldEnchantedSword: true, lootingLevel: 10 })).toBe(
      LOOTING_MAX_LEVEL,
    );
  });
});
