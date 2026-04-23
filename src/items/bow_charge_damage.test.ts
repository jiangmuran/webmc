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

  it('power enchant boosts', () => {
    expect(arrowDamage(20, 5)).toBeGreaterThan(arrowDamage(20, 0));
  });

  it('crit only at full', () => {
    expect(critChance(20)).toBeGreaterThan(0);
    expect(critChance(5)).toBe(0);
  });
});
