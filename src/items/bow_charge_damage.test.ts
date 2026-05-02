import { describe, it, expect } from 'vitest';
import { chargeFraction, arrowVelocity, arrowDamage, critChance } from './bow_charge_damage';

describe('bow charge damage', () => {
  it('fraction clamps', () => {
    expect(chargeFraction(-10)).toBe(0);
    expect(chargeFraction(10000)).toBe(1);
  });

  it('higher charge more velocity', () => {
    expect(arrowVelocity(20)).toBeGreaterThan(arrowVelocity(5));
  });

  it('fully charged high damage', () => {
    expect(arrowDamage(20, 0)).toBeGreaterThan(arrowDamage(2, 0));
  });

  it('full-charge no-enchant base damage is 6 (wiki: ceil(velocity×2) = 6)', () => {
    expect(arrowDamage(20, 0)).toBe(6);
  });

  it('power enchant boosts via wiki ceil(0.25*(L+1)*base) formula', () => {
    // Wiki: bonus = ceil(0.25 × (level + 1) × base).
    // base=6: P1 → 6+ceil(3)=9, P5 → 6+ceil(9)=15.
    expect(arrowDamage(20, 1)).toBe(9);
    expect(arrowDamage(20, 5)).toBe(15);
  });

  it('crit only at full', () => {
    expect(critChance(20)).toBeGreaterThan(0);
    expect(critChance(5)).toBe(0);
  });
});
