import { describe, it, expect } from 'vitest';
import { fallDamage, rawFallDamage, type FallInput } from './fall_damage_calc';

const base: FallInput = {
  distanceFallen: 10,
  featherFallingLevel: 0,
  slowFalling: false,
  jumpBoost: 0,
  onHay: false,
  onSlime: false,
  onHoney: false,
  inWater: false,
};

describe('fall damage calc', () => {
  it('3 block fall safe', () => {
    expect(rawFallDamage(3, 0)).toBe(0);
  });

  it('10 block fall hurts', () => {
    expect(rawFallDamage(10, 0)).toBe(7);
  });

  it('slow falling no damage', () => {
    expect(fallDamage({ ...base, slowFalling: true })).toBe(0);
  });

  it('water breaks fall', () => {
    expect(fallDamage({ ...base, inWater: true })).toBe(0);
  });

  it('slime block absorbs', () => {
    expect(fallDamage({ ...base, onSlime: true })).toBe(0);
  });

  it('hay reduces damage', () => {
    const plain = fallDamage(base);
    const hay = fallDamage({ ...base, onHay: true });
    expect(hay).toBeLessThan(plain);
  });

  it('feather falling reduces', () => {
    expect(fallDamage({ ...base, featherFallingLevel: 4 })).toBeLessThan(fallDamage(base));
  });

  it('jump boost ignores extra damage', () => {
    expect(rawFallDamage(6, 2)).toBe(1);
  });
});
