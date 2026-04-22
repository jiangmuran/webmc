import { describe, it, expect } from 'vitest';
import { applyEnchant, type Enchanted } from './enchantment';
import { fireCrossbow, isLoaded, makeCrossbow, requiredChargeSec, tickCharge } from './crossbow';

const PLAIN: Enchanted = { itemId: 1, count: 1, damage: 0 };

describe('crossbow', () => {
  it('requires 1.25s to full charge', () => {
    expect(requiredChargeSec(PLAIN)).toBeCloseTo(1.25, 3);
  });

  it('quick_charge reduces charge time', () => {
    const e = applyEnchant(PLAIN, 'quick_charge', 3);
    expect(requiredChargeSec(e)).toBeLessThan(1);
  });

  it('charges + loads arrow after charge', () => {
    const c = makeCrossbow();
    for (let i = 0; i < 15; i++) {
      tickCharge(c, 0.1, { charging: true, haveProjectile: true, enchants: PLAIN });
    }
    expect(isLoaded(c)).toBe(true);
  });

  it('multishot loads 3 arrows', () => {
    const c = makeCrossbow();
    const e = applyEnchant(PLAIN, 'multishot', 1);
    for (let i = 0; i < 15; i++) {
      tickCharge(c, 0.1, { charging: true, haveProjectile: true, enchants: e });
    }
    const r = fireCrossbow(c, e);
    expect(r.shots.length).toBe(3);
    expect(r.shots[0]?.yawOffset).toBe(-10);
  });

  it('fire returns pierce level', () => {
    const c = makeCrossbow();
    const e = applyEnchant(PLAIN, 'piercing', 2);
    for (let i = 0; i < 15; i++) {
      tickCharge(c, 0.1, { charging: true, haveProjectile: true, enchants: e });
    }
    const r = fireCrossbow(c, e);
    expect(r.shots[0]?.pierce).toBe(2);
  });

  it('releasing early resets charge', () => {
    const c = makeCrossbow();
    tickCharge(c, 0.5, { charging: true, haveProjectile: true, enchants: PLAIN });
    tickCharge(c, 0.5, { charging: false, haveProjectile: true, enchants: PLAIN });
    expect(c.chargeSec).toBe(0);
    expect(isLoaded(c)).toBe(false);
  });
});
