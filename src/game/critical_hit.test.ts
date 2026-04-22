import { describe, it, expect } from 'vitest';
import { critMultiplier, isCriticalHit, sweepingAttack } from './critical_hit';

describe('critical hit', () => {
  it('falling + mid-air = crit', () => {
    const q = {
      velocityY: -5,
      onGround: false,
      sprinting: false,
      inWater: false,
      hasBlindness: false,
    };
    expect(isCriticalHit(q)).toBe(true);
    expect(critMultiplier(q)).toBe(1.5);
  });

  it('sprinting prevents crit', () => {
    expect(
      isCriticalHit({
        velocityY: -5,
        onGround: false,
        sprinting: true,
        inWater: false,
        hasBlindness: false,
      }),
    ).toBe(false);
  });

  it('on ground prevents crit', () => {
    expect(
      isCriticalHit({
        velocityY: 0,
        onGround: true,
        sprinting: false,
        inWater: false,
        hasBlindness: false,
      }),
    ).toBe(false);
  });

  it('water + blindness prevent crit', () => {
    expect(
      isCriticalHit({
        velocityY: -5,
        onGround: false,
        sprinting: false,
        inWater: true,
        hasBlindness: false,
      }),
    ).toBe(false);
    expect(
      isCriticalHit({
        velocityY: -5,
        onGround: false,
        sprinting: false,
        inWater: false,
        hasBlindness: true,
      }),
    ).toBe(false);
  });
});

describe('sweeping attack', () => {
  it("refuses when attack isn't fully charged", () => {
    const r = sweepingAttack({
      sweepingEdgeLevel: 3,
      baseSwordDamage: 7,
      sharpnessBonus: 0,
      attackChargedRatio: 0.5,
    });
    expect(r.sweeps).toBe(false);
  });

  it('sweep damage scales with sweeping_edge', () => {
    const r0 = sweepingAttack({
      sweepingEdgeLevel: 0,
      baseSwordDamage: 7,
      sharpnessBonus: 0,
      attackChargedRatio: 1,
    });
    const r3 = sweepingAttack({
      sweepingEdgeLevel: 3,
      baseSwordDamage: 7,
      sharpnessBonus: 0,
      attackChargedRatio: 1,
    });
    expect(r3.sweepDamage).toBeGreaterThan(r0.sweepDamage);
  });
});
