import { describe, it, expect } from 'vitest';
import { hasShield, explosionImmuneFromArrows, meleeOnlyBelowShield } from './wither_boss_shield';

describe('wither boss shield', () => {
  it('shield BELOW 50pct (wiki: armor activates when injured)', () => {
    expect(hasShield({ hpPercent: 0.3 })).toBe(true);
  });

  it('no shield above 50pct (wiki: flying phase is ranged-vulnerable)', () => {
    expect(hasShield({ hpPercent: 0.9 })).toBe(false);
  });

  it('arrows blocked while shielded (low HP)', () => {
    expect(explosionImmuneFromArrows({ hpPercent: 0.2 })).toBe(true);
  });

  it('melee available while shielded (low HP)', () => {
    expect(meleeOnlyBelowShield({ hpPercent: 0.2 })).toBe(true);
    expect(meleeOnlyBelowShield({ hpPercent: 0.8 })).toBe(false);
  });
});
