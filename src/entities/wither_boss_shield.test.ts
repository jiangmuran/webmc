import { describe, it, expect } from 'vitest';
import { hasShield, explosionImmuneFromArrows, meleeOnlyBelowShield } from './wither_boss_shield';

describe('wither boss shield', () => {
  it('shield above 50pct', () => {
    expect(hasShield({ hpPercent: 0.9 })).toBe(true);
  });

  it('no shield below 50pct', () => {
    expect(hasShield({ hpPercent: 0.3 })).toBe(false);
  });

  it('arrows blocked while shielded', () => {
    expect(explosionImmuneFromArrows({ hpPercent: 0.8 })).toBe(true);
  });

  it('melee available below shield', () => {
    expect(meleeOnlyBelowShield({ hpPercent: 0.2 })).toBe(true);
    expect(meleeOnlyBelowShield({ hpPercent: 0.8 })).toBe(false);
  });
});
