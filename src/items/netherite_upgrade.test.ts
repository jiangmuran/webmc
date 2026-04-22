import { describe, it, expect } from 'vitest';
import { canUpgrade, resultId, preserveDurabilityPct, templateConsumed } from './netherite_upgrade';

describe('netherite upgrade', () => {
  it('valid inputs', () => {
    expect(
      canUpgrade({
        template: 'netherite_upgrade',
        base: 'diamond_sword',
        additive: 'netherite_ingot',
      }),
    ).toBe(true);
  });

  it('rejects wrong template', () => {
    expect(
      canUpgrade({ template: 'other', base: 'diamond_sword', additive: 'netherite_ingot' }),
    ).toBe(false);
  });

  it('rejects wrong additive', () => {
    expect(
      canUpgrade({ template: 'netherite_upgrade', base: 'diamond_sword', additive: 'other' }),
    ).toBe(false);
  });

  it('result id', () => {
    expect(resultId('diamond_sword')).toBe('netherite_sword');
    expect(resultId('diamond_chestplate')).toBe('netherite_chestplate');
  });

  it('durability pct preserved', () => {
    expect(preserveDurabilityPct(800, 1561, 2031)).toBeCloseTo(Math.floor((800 / 1561) * 2031));
  });

  it('template consumed', () => {
    expect(templateConsumed()).toBe(true);
  });
});
