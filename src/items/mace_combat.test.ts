import { describe, it, expect } from 'vitest';
import { smashDamage, windBurstHeight, breachArmorIgnoreFraction } from './mace_combat';

describe('mace combat', () => {
  it('no fall just base', () => {
    const base = { fallDistance: 1, densityBonus: 0, windBurstLevel: 0, breachLevel: 0, baseDamage: 6 };
    expect(smashDamage(base)).toBe(6);
  });

  it('fall increases damage', () => {
    const hi = { fallDistance: 10, densityBonus: 0, windBurstLevel: 0, breachLevel: 0, baseDamage: 6 };
    expect(smashDamage(hi)).toBeGreaterThan(6);
  });

  it('wind burst scales', () => {
    expect(windBurstHeight(3)).toBeGreaterThan(windBurstHeight(1));
  });

  it('breach ignore clamped', () => {
    expect(breachArmorIgnoreFraction(100)).toBe(1);
  });
});
