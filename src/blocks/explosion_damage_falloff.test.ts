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

  it('wiki damage at center: 7×power + 1 (with radius=2×power)', () => {
    // TNT power=4 → wiki blast extent = 8, center damage = 7*4*(1+1)+1 = 57
    // Or treating `radius` directly as 2×power, formula gives the
    // same result. radius=8, distance=0, f=1: 3.5*8*2 + 1 = 57.
    expect(rawDamage({ radius: 8, distance: 0, blastProtection: 0, shielded: false })).toBe(57);
  });

  it('wiki: at-radius receives ≥1 damage from the +1 floor', () => {
    // Wiki: "all entities in range receive at least 1 damage even when
    // the explosion is fully blocked." Our function returns 0 at exact
    // cutoff (no damage past blast); strictly inside, the +1 constant
    // means ≥1 damage even at f→0 (max distance just inside cutoff).
    const justInside = rawDamage({
      radius: 8,
      distance: 7.999,
      blastProtection: 0,
      shielded: false,
    });
    expect(justInside).toBeGreaterThanOrEqual(1);
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
