import { describe, it, expect } from 'vitest';
import { canCharge, afterCharge, MAX_CHARGES } from './respawn_anchor_charge_crafting';

describe('respawn anchor charge crafting', () => {
  it('charges with glowstone', () => {
    expect(canCharge({ charges: 0, dimensionAllowed: true, itemGlowstone: true })).toBe(true);
  });

  it('max 4', () => {
    expect(canCharge({ charges: MAX_CHARGES, dimensionAllowed: true, itemGlowstone: true })).toBe(
      false,
    );
  });

  it('non-glowstone fails', () => {
    expect(canCharge({ charges: 0, dimensionAllowed: true, itemGlowstone: false })).toBe(false);
  });

  it('charges increment', () => {
    expect(
      afterCharge({ charges: 2, dimensionAllowed: true, itemGlowstone: true }).charges,
    ).toBe(3);
  });
});
