import { describe, it, expect } from 'vitest';
import { sharpnessBonus, smiteBonus, baneBonus, mutuallyExclusive } from './sharpness_smite_bane';

describe('sharpness smite bane', () => {
  it('sharpness 5 = 3', () => {
    expect(sharpnessBonus(5)).toBe(3);
  });

  it('no level zero bonus', () => {
    expect(sharpnessBonus(0)).toBe(0);
  });

  it('smite 5 vs zombie 12.5', () => {
    expect(smiteBonus(5, 'zombie')).toBe(12.5);
  });

  it('smite no effect on cow', () => {
    expect(smiteBonus(5, 'cow')).toBe(0);
  });

  it('smite affects skeleton_horse and zombie_horse (wiki: undead since 1.9)', () => {
    expect(smiteBonus(5, 'skeleton_horse')).toBe(12.5);
    expect(smiteBonus(5, 'zombie_horse')).toBe(12.5);
  });

  it('bane vs spider', () => {
    expect(baneBonus(3, 'spider')).toBeCloseTo(7.5);
  });

  it('exclusive enforced', () => {
    expect(mutuallyExclusive(1, 0, 0)).toBe(true);
    expect(mutuallyExclusive(1, 1, 0)).toBe(false);
  });
});
