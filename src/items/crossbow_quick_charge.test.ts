import { describe, it, expect } from 'vitest';
import {
  chargeTicksWithEnchant,
  chargeCrossbow,
  shoot,
  BASE_CROSSBOW_CHARGE_TICKS,
  type ChargedCrossbow,
} from './crossbow_quick_charge';

describe('crossbow quick charge', () => {
  it('base charge time', () => {
    expect(chargeTicksWithEnchant(0)).toBe(BASE_CROSSBOW_CHARGE_TICKS);
  });

  it('quick charge cuts time', () => {
    expect(chargeTicksWithEnchant(4)).toBeLessThan(BASE_CROSSBOW_CHARGE_TICKS);
  });

  it('min 1 tick', () => {
    expect(chargeTicksWithEnchant(999)).toBeGreaterThanOrEqual(1);
  });

  it('charge loads arrow', () => {
    const c: ChargedCrossbow = { loaded: false };
    expect(chargeCrossbow(c, 'arrow').loaded).toBe(true);
  });

  it('shoot fires projectile', () => {
    const c: ChargedCrossbow = { loaded: true, projectile: 'firework_rocket' };
    expect(shoot(c).fired).toBe('firework_rocket');
  });

  it('empty crossbow no fire', () => {
    expect(shoot({ loaded: false }).fired).toBeUndefined();
  });
});
