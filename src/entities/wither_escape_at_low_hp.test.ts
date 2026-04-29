import { describe, it, expect } from 'vitest';
import { atMeleePhase, takesRangedDamage, explodesOnApproach } from './wither_escape_at_low_hp';

describe('wither escape at low hp', () => {
  it('melee phase below 50%', () => {
    expect(atMeleePhase({ hpPercent: 0.4, hasShield: false, inLowHpAerial: true })).toBe(true);
  });

  it('full hp full shield', () => {
    expect(atMeleePhase({ hpPercent: 1, hasShield: true, inLowHpAerial: false })).toBe(false);
  });

  it('shield blocks ranged', () => {
    expect(takesRangedDamage({ hpPercent: 0.8, hasShield: true, inLowHpAerial: false })).toBe(
      false,
    );
  });

  it('low hp shielded blocks ranged (wiki: armor below 50% is arrow-immune)', () => {
    // Wiki: when wither's HP drops below 50%, the armored body kicks
    // in and blocks ranged damage entirely.
    expect(takesRangedDamage({ hpPercent: 0.4, hasShield: true, inLowHpAerial: true })).toBe(false);
  });
  it('shieldless wither takes ranged at any HP', () => {
    expect(takesRangedDamage({ hpPercent: 0.4, hasShield: false, inLowHpAerial: true })).toBe(true);
  });

  it('approach explosion power', () => {
    expect(explodesOnApproach()).toBeGreaterThan(0);
  });
});
