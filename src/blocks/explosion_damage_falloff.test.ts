import { describe, it, expect } from 'vitest';
import {
  rawDamage,
  reducedByProtection,
  appliedDamage,
  blockBreakProbability,
} from './explosion_damage_falloff';

describe('explosion damage falloff', () => {
  it('zero at radius', () => {
    expect(rawDamage({ radius: 4, distance: 4, blastProtection: 0, shielded: false })).toBe(0);
  });

  it('max at center', () => {
    expect(
      rawDamage({ radius: 4, distance: 0, blastProtection: 0, shielded: false }),
    ).toBeGreaterThan(0);
  });

  it('protection reduces', () => {
    const raw = rawDamage({ radius: 4, distance: 1, blastProtection: 0, shielded: false });
    const prot = reducedByProtection(raw, 4);
    expect(prot).toBeLessThan(raw);
  });

  it('protection capped at 80%', () => {
    const prot = reducedByProtection(100, 100);
    expect(prot).toBeCloseTo(20);
  });

  it('shield halves', () => {
    const withoutShield = appliedDamage({
      radius: 4,
      distance: 1,
      blastProtection: 0,
      shielded: false,
    });
    const withShield = appliedDamage({
      radius: 4,
      distance: 1,
      blastProtection: 0,
      shielded: true,
    });
    expect(withShield).toBeLessThanOrEqual(withoutShield);
  });

  it('strong block rarely breaks', () => {
    expect(blockBreakProbability(100, 4)).toBe(0);
  });

  it('weak block breaks', () => {
    expect(blockBreakProbability(0, 4)).toBe(1);
  });
});
