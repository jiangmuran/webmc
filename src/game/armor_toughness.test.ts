import { describe, it, expect } from 'vitest';
import { applyArmorReduction, armorTotal, damageAfterArmor } from './armor_toughness';

describe('armor toughness', () => {
  it('0 armor = full damage', () => {
    expect(applyArmorReduction({ armor: 0, toughness: 0, incomingDamage: 10 })).toBe(10);
  });

  it('full iron (15 armor) halves small hits', () => {
    const d = applyArmorReduction({ armor: 15, toughness: 0, incomingDamage: 4 });
    expect(d).toBeLessThan(4);
    expect(d).toBeGreaterThan(0);
  });

  it('caps reduction at 80%', () => {
    const d = applyArmorReduction({ armor: 20, toughness: 20, incomingDamage: 10 });
    expect(d).toBeGreaterThanOrEqual(10 * 0.2);
  });

  it('toughness helps against big hits', () => {
    const noTough = applyArmorReduction({ armor: 20, toughness: 0, incomingDamage: 60 });
    const withTough = applyArmorReduction({ armor: 20, toughness: 12, incomingDamage: 60 });
    expect(withTough).toBeLessThan(noTough);
  });

  it('armorTotal sums pieces', () => {
    expect(armorTotal({ helmet: 2, chest: 6, leggings: 5, boots: 2 })).toBe(15);
  });

  it('damageAfterArmor rounds to milli-HP', () => {
    const d = damageAfterArmor({ armor: 15, toughness: 0, incomingDamage: 4 });
    const str = d.toString();
    // no more than 3 decimals
    const dot = str.indexOf('.');
    if (dot >= 0) {
      expect(str.length - dot - 1).toBeLessThanOrEqual(3);
    }
  });
});
