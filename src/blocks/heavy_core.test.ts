import { describe, it, expect } from 'vitest';
import {
  fallDamage,
  canCraftMace,
  affectedByGravity,
  HEAVY_CORE_MAX_FALL_DAMAGE,
} from './heavy_core';

describe('heavy core', () => {
  it('no damage 1 block', () => {
    expect(fallDamage(1)).toBe(0);
  });

  it('2 blocks = 2', () => {
    expect(fallDamage(2)).toBe(2);
  });

  it('caps at max', () => {
    expect(fallDamage(1000)).toBe(HEAVY_CORE_MAX_FALL_DAMAGE);
  });

  it('mace needs both', () => {
    expect(canCraftMace({ breezeRod: true, heavyCore: true })).toBe(true);
    expect(canCraftMace({ breezeRod: true, heavyCore: false })).toBe(false);
  });

  it('gravity', () => {
    expect(affectedByGravity()).toBe(true);
  });
});
