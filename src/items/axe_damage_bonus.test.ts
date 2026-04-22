import { describe, it, expect } from 'vitest';
import { attackDamage, axeDamage, axeSpeed, swordDamage, swordSpeed } from './axe_damage_bonus';

describe('axe damage', () => {
  it('netherite axe hardest', () => {
    expect(axeDamage('netherite')).toBe(10);
  });

  it('axes hit harder than swords in same tier', () => {
    expect(axeDamage('diamond')).toBeGreaterThan(swordDamage('diamond'));
  });

  it('swords swing faster', () => {
    expect(swordSpeed()).toBeGreaterThan(axeSpeed('netherite'));
  });

  it('full charge critical axe = 1.5× base', () => {
    const dmg = attackDamage({
      tool: 'axe',
      tier: 'netherite',
      chargedFraction: 1,
      critical: true,
    });
    expect(dmg).toBe(15);
  });

  it('uncharged attack deals 20% base', () => {
    const dmg = attackDamage({
      tool: 'axe',
      tier: 'netherite',
      chargedFraction: 0,
      critical: false,
    });
    expect(dmg).toBe(2);
  });

  it('fist = 1 damage base', () => {
    expect(attackDamage({ tool: 'fist', tier: null, chargedFraction: 1, critical: false })).toBe(1);
  });
});
