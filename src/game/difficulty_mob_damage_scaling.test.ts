import { describe, it, expect } from 'vitest';
import {
  mobBaseDamageMultiplier,
  regionalDifficultyAdd,
  scaledDamage,
} from './difficulty_mob_damage_scaling';

describe('difficulty mob damage scaling', () => {
  it('peaceful nullifies damage', () => {
    expect(mobBaseDamageMultiplier('peaceful')).toBe(0);
  });

  it('hard amplifies', () => {
    expect(mobBaseDamageMultiplier('hard')).toBeGreaterThan(mobBaseDamageMultiplier('normal'));
  });

  it('regional tops out at 1', () => {
    expect(regionalDifficultyAdd(1e9, 1e5)).toBeLessThanOrEqual(1);
  });

  it('fresh chunk near zero', () => {
    expect(regionalDifficultyAdd(0, 0)).toBe(0);
  });

  it('scaled damage on peaceful zero', () => {
    expect(scaledDamage(10, 'peaceful', 1)).toBe(0);
  });

  it('scaled damage on hard amplified', () => {
    expect(scaledDamage(10, 'hard', 1)).toBeGreaterThan(10);
  });

  it('regional increases damage', () => {
    expect(scaledDamage(10, 'normal', 1)).toBeGreaterThan(scaledDamage(10, 'normal', 0));
  });
});
