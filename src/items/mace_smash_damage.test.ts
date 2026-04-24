import { describe, it, expect } from 'vitest';
import {
  smashBonusDamage,
  totalMaceDamage,
  breachReducesArmor,
  windBurstVelocity,
} from './mace_smash_damage';

describe('mace smash damage', () => {
  it('short fall no bonus', () => {
    expect(
      smashBonusDamage({ fallDistance: 1, densityLevel: 0, breachLevel: 0, windBurstLevel: 0 }),
    ).toBe(0);
  });

  it('falling amplifies', () => {
    expect(
      smashBonusDamage({ fallDistance: 10, densityLevel: 0, breachLevel: 0, windBurstLevel: 0 }),
    ).toBeGreaterThan(0);
  });

  it('density enchant increases', () => {
    const plain = smashBonusDamage({
      fallDistance: 10,
      densityLevel: 0,
      breachLevel: 0,
      windBurstLevel: 0,
    });
    const dense = smashBonusDamage({
      fallDistance: 10,
      densityLevel: 5,
      breachLevel: 0,
      windBurstLevel: 0,
    });
    expect(dense).toBeGreaterThan(plain);
  });

  it('total = melee + smash', () => {
    const input = { fallDistance: 10, densityLevel: 0, breachLevel: 0, windBurstLevel: 0 };
    const total = totalMaceDamage(input, 6);
    expect(total).toBeGreaterThan(6);
  });

  it('breach reduces armor', () => {
    expect(breachReducesArmor(4, 20)).toBeLessThan(20);
  });

  it('wind burst velocity scales', () => {
    expect(windBurstVelocity(3)).toBe(1.5);
  });
});
