import { describe, it, expect } from 'vitest';
import { arrowAirDrag, arrowDamage, computeArrowShot } from './arrow_critical';

describe('arrow critical', () => {
  it('full draw = critical', () => {
    const r = computeArrowShot({
      chargeFraction: 1,
      fromCrossbow: false,
      powerEnchantLevel: 0,
    });
    expect(r.critical).toBe(true);
  });

  it('partial draw = not critical', () => {
    const r = computeArrowShot({
      chargeFraction: 0.5,
      fromCrossbow: false,
      powerEnchantLevel: 0,
    });
    expect(r.critical).toBe(false);
    expect(r.velocityMultiplier).toBe(0.5);
  });

  it('crossbow never critical', () => {
    const r = computeArrowShot({
      chargeFraction: 1,
      fromCrossbow: true,
      powerEnchantLevel: 0,
    });
    expect(r.critical).toBe(false);
  });

  it('base damage = ceil(speed × 2)', () => {
    const d = arrowDamage({
      arrowSpeed: 2,
      powerEnchantLevel: 0,
      critical: false,
      rng: () => 0,
    });
    expect(d).toBe(4);
  });

  it('critical bonus adds', () => {
    const base = arrowDamage({
      arrowSpeed: 2,
      powerEnchantLevel: 0,
      critical: false,
      rng: () => 0.99,
    });
    const crit = arrowDamage({
      arrowSpeed: 2,
      powerEnchantLevel: 0,
      critical: true,
      rng: () => 0.99,
    });
    expect(crit).toBeGreaterThanOrEqual(base);
  });

  it('power enchant adds damage', () => {
    const base = arrowDamage({
      arrowSpeed: 2,
      powerEnchantLevel: 0,
      critical: false,
      rng: () => 0,
    });
    const powered = arrowDamage({
      arrowSpeed: 2,
      powerEnchantLevel: 5,
      critical: false,
      rng: () => 0,
    });
    expect(powered).toBeGreaterThan(base);
  });

  it('air drag decelerates', () => {
    expect(arrowAirDrag(10)).toBeLessThan(10);
  });

  it('Power V at full draw deals 15 (wiki: 6 + 150% = 15)', () => {
    expect(
      arrowDamage({
        arrowSpeed: 3,
        powerEnchantLevel: 5,
        critical: false,
        rng: () => 0,
      }),
    ).toBe(15);
  });

  it('Power bonus rounds UP per wiki', () => {
    // arrowSpeed=2.5 → base=ceil(5)=5. Power IV: 5 × 0.25 × 5 = 6.25
    // → ceil → 7 → total 12. Round-down would give 11.
    expect(
      arrowDamage({
        arrowSpeed: 2.5,
        powerEnchantLevel: 4,
        critical: false,
        rng: () => 0,
      }),
    ).toBe(12);
  });
});
