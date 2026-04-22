import { describe, it, expect } from 'vitest';
import { computeMaceDamage, craftMace, smashAttackFallReset, windBurstImpulse } from './mace';

describe('mace', () => {
  it('base damage without fall = 5', () => {
    expect(computeMaceDamage({ fallDistance: 0, critical: false, densityLevel: 0 })).toBe(5);
  });

  it('falling 3 blocks adds 9 smash', () => {
    expect(computeMaceDamage({ fallDistance: 3, critical: true, densityLevel: 0 })).toBe(5 + 9);
  });

  it('falling 10 blocks stacks tiers', () => {
    // 3*3 + 5*4 + 2*2 = 9 + 20 + 4 = 33
    expect(computeMaceDamage({ fallDistance: 10, critical: true, densityLevel: 0 })).toBe(5 + 33);
  });

  it('density adds per-block bonus', () => {
    const base = computeMaceDamage({ fallDistance: 4, critical: true, densityLevel: 0 });
    const dense = computeMaceDamage({ fallDistance: 4, critical: true, densityLevel: 2 });
    expect(dense).toBeGreaterThan(base);
  });

  it('non-critical hit ignores fall', () => {
    expect(computeMaceDamage({ fallDistance: 10, critical: false, densityLevel: 0 })).toBe(5);
  });

  it('crafts with heavy core + breeze rod', () => {
    expect(craftMace({ heavyCore: 1, breezeRod: 1 })).not.toBeNull();
    expect(craftMace({ heavyCore: 0, breezeRod: 1 })).toBeNull();
  });

  it('smash cancels attacker fall damage', () => {
    expect(smashAttackFallReset(20)).toBe(0);
  });

  it('wind burst impulse scales with level', () => {
    expect(windBurstImpulse(0)).toBe(0);
    expect(windBurstImpulse(3)).toBeGreaterThan(windBurstImpulse(1));
  });
});
