import { describe, it, expect } from 'vitest';
import { smashDamage, armorEffectiveness, resetsFallDamage, MACE_BASE_DAMAGE } from './mace_smash';

describe('mace smash', () => {
  it('no fall = base', () => {
    expect(smashDamage({ fallDistance: 0, densityLevel: 0, breachLevel: 0 })).toBe(
      MACE_BASE_DAMAGE,
    );
  });

  it('1 block fall = base + 4', () => {
    expect(smashDamage({ fallDistance: 1, densityLevel: 0, breachLevel: 0 })).toBe(
      MACE_BASE_DAMAGE + 4,
    );
  });

  it('3 blocks: 12 bonus', () => {
    expect(smashDamage({ fallDistance: 3, densityLevel: 0, breachLevel: 0 })).toBe(
      MACE_BASE_DAMAGE + 12,
    );
  });

  it('8 blocks: 12 + 10 = 22 bonus', () => {
    expect(smashDamage({ fallDistance: 8, densityLevel: 0, breachLevel: 0 })).toBe(
      MACE_BASE_DAMAGE + 22,
    );
  });

  it('density adds with fall', () => {
    const a = smashDamage({ fallDistance: 4, densityLevel: 0, breachLevel: 0 });
    const b = smashDamage({ fallDistance: 4, densityLevel: 2, breachLevel: 0 });
    expect(b).toBeGreaterThan(a);
  });

  it('breach reduces armor 15% per level', () => {
    expect(armorEffectiveness(0)).toBe(1);
    expect(armorEffectiveness(2)).toBeCloseTo(0.7);
    expect(armorEffectiveness(10)).toBe(0);
  });

  it('smash resets fall damage', () => {
    expect(resetsFallDamage(true)).toBe(true);
  });
});
