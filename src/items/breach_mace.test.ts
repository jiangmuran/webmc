import { describe, it, expect } from 'vitest';
import {
  armorEffectivenessFactor,
  armorAfter,
  appliesOnlyTo,
  incompatibleWith,
  BREACH_MAX,
} from './breach_mace';

describe('breach mace', () => {
  it('level 0 = 1', () => {
    expect(armorEffectivenessFactor(0)).toBe(1);
  });

  it('level 4 = 0.4', () => {
    expect(armorEffectivenessFactor(4)).toBeCloseTo(0.4);
  });

  it('caps at max', () => {
    expect(armorEffectivenessFactor(10)).toBe(armorEffectivenessFactor(BREACH_MAX));
  });

  it('armor reduced', () => {
    expect(armorAfter(20, 2)).toBeCloseTo(14);
  });

  it('mace only', () => {
    expect(appliesOnlyTo('mace')).toBe(true);
    expect(appliesOnlyTo('sword')).toBe(false);
  });

  it('incompat density', () => {
    expect(incompatibleWith()).toContain('density');
  });
});
