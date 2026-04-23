import { describe, it, expect } from 'vitest';
import { baseFallDamage, adjustedFallDamage, type FallMods } from './fall_damage_calc';

const zero: FallMods = {
  hayBale: false,
  water: false,
  slowFalling: false,
  featherFallingLevel: 0,
  jumpBoostLevel: 0,
  boots: false,
};

describe('fall damage calc', () => {
  it('3 blocks safe', () => {
    expect(baseFallDamage(3)).toBe(0);
  });

  it('10 blocks = 7', () => {
    expect(baseFallDamage(10)).toBe(7);
  });

  it('water nullifies', () => {
    expect(adjustedFallDamage(20, { ...zero, water: true })).toBe(0);
  });

  it('slow falling nullifies', () => {
    expect(adjustedFallDamage(20, { ...zero, slowFalling: true })).toBe(0);
  });

  it('hay 80% reduction', () => {
    expect(adjustedFallDamage(10, { ...zero, hayBale: true })).toBeCloseTo(7 * 0.2);
  });

  it('feather falling reduces', () => {
    expect(adjustedFallDamage(10, { ...zero, featherFallingLevel: 4 })).toBeLessThan(7);
  });

  it('jump boost lifts start', () => {
    expect(adjustedFallDamage(5, { ...zero, jumpBoostLevel: 2 })).toBe(0);
  });
});
