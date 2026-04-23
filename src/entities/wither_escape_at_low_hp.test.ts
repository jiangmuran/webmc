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

  it('low hp no shield takes ranged', () => {
    expect(takesRangedDamage({ hpPercent: 0.4, hasShield: true, inLowHpAerial: true })).toBe(true);
  });

  it('approach explosion power', () => {
    expect(explodesOnApproach()).toBeGreaterThan(0);
  });
});
