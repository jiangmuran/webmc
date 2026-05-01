import { describe, it, expect } from 'vitest';
import { smashDamage, windBurstHeight, breachArmorIgnoreFraction } from './mace_combat';

describe('mace combat', () => {
  it('no fall just base', () => {
    const base = {
      fallDistance: 1,
      densityBonus: 0,
      windBurstLevel: 0,
      breachLevel: 0,
      baseDamage: 6,
    };
    expect(smashDamage(base)).toBe(6);
  });

  it('fall increases damage', () => {
    const hi = {
      fallDistance: 10,
      densityBonus: 0,
      windBurstLevel: 0,
      breachLevel: 0,
      baseDamage: 6,
    };
    expect(smashDamage(hi)).toBeGreaterThan(6);
  });

  it('wind burst scales', () => {
    expect(windBurstHeight(3)).toBeGreaterThan(windBurstHeight(1));
  });

  it('breach ignore clamped', () => {
    expect(breachArmorIgnoreFraction(100)).toBe(1);
  });

  it('smash bonus piecewise per wiki (4/2/1 per block tier)', () => {
    // Wiki minecraft.wiki/w/Mace#Smash_attack: tier-1 (1-3 blocks)
    // 4 dmg each, tier-2 (4-8) 2 each, tier-3 (9+) 1 each.
    const base = {
      densityBonus: 0,
      windBurstLevel: 0,
      breachLevel: 0,
      baseDamage: 0,
    };
    // fall=3 → 3 × 4 = 12
    expect(smashDamage({ ...base, fallDistance: 3 })).toBe(12);
    // fall=5 → 3×4 + 2×2 = 16 (was old: capped at 8)
    expect(smashDamage({ ...base, fallDistance: 5 })).toBe(16);
    // fall=10 → 3×4 + 5×2 + 2×1 = 24 (was old: capped at 8)
    expect(smashDamage({ ...base, fallDistance: 10 })).toBe(24);
  });
});
