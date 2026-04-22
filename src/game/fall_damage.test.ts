import { describe, it, expect } from 'vitest';
import { computeFallDamage, fallDamageHearts, safeFallHeight } from './fall_damage';

const BASE = {
  featherFallingLevel: 0,
  jumpBoostLevel: 0,
  slowFalling: false,
  inWater: false,
  onHayBale: false,
  onSlime: false,
};

describe('fall damage', () => {
  it('3 blocks = no damage', () => {
    expect(computeFallDamage({ ...BASE, fallDistance: 3 })).toBe(0);
  });

  it('5 blocks = 2 damage', () => {
    expect(computeFallDamage({ ...BASE, fallDistance: 5 })).toBe(2);
  });

  it('water cancels fall damage', () => {
    expect(computeFallDamage({ ...BASE, fallDistance: 100, inWater: true })).toBe(0);
  });

  it('slow falling cancels damage', () => {
    expect(computeFallDamage({ ...BASE, fallDistance: 100, slowFalling: true })).toBe(0);
  });

  it('hay bale reduces to 20%', () => {
    const d = computeFallDamage({ ...BASE, fallDistance: 13, onHayBale: true });
    expect(d).toBeCloseTo(10 * 0.2);
  });

  it('slime cancels damage', () => {
    expect(computeFallDamage({ ...BASE, fallDistance: 50, onSlime: true })).toBe(0);
  });

  it('feather falling reduces damage', () => {
    const base = computeFallDamage({ ...BASE, fallDistance: 20 });
    const ff = computeFallDamage({ ...BASE, fallDistance: 20, featherFallingLevel: 4 });
    expect(ff).toBeLessThan(base);
  });

  it('jump boost raises safe height', () => {
    expect(safeFallHeight({ ...BASE, jumpBoostLevel: 2 })).toBe(5);
  });

  it('slow falling = infinite safe height', () => {
    expect(safeFallHeight({ ...BASE, slowFalling: true })).toBe(Infinity);
  });

  it('hearts = damage / 2', () => {
    const h = fallDamageHearts({ ...BASE, fallDistance: 7 });
    expect(h).toBe(2);
  });
});
