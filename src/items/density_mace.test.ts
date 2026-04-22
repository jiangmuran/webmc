import { describe, it, expect } from 'vitest';
import { bonusPerFallBlock, totalBonus, appliesOnlyTo, DENSITY_MAX } from './density_mace';

describe('density mace', () => {
  it('level 0 no bonus', () => {
    expect(bonusPerFallBlock(0)).toBe(0);
  });

  it('level 5 = 2.5/block', () => {
    expect(bonusPerFallBlock(5)).toBe(2.5);
  });

  it('caps at max', () => {
    expect(bonusPerFallBlock(100)).toBe(bonusPerFallBlock(DENSITY_MAX));
  });

  it('total scales with fall', () => {
    expect(totalBonus(3, 10)).toBeCloseTo(15);
  });

  it('mace only', () => {
    expect(appliesOnlyTo('mace')).toBe(true);
    expect(appliesOnlyTo('sword')).toBe(false);
  });
});
