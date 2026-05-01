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

  it('preserves damage points lost, not percentage (wiki)', () => {
    // Diamond pickaxe (max 1561) with 800/1561 (lost 761) → netherite
    // pickaxe (max 2031) with 2031-761 = 1270, NOT the percentage-
    // scaled 800/1561 × 2031 = 1041 the old formula computed.
    expect(preserveDurabilityPct(800, 1561, 2031)).toBe(1270);
  });

  it('full diamond → full netherite', () => {
    expect(preserveDurabilityPct(1561, 1561, 2031)).toBe(2031);
  });

  it('zero diamond → zero netherite (but new max applies)', () => {
    // 0 / 1561 means 1561 lost. Netherite has 2031 max, 2031 - 1561 = 470 remaining.
    expect(preserveDurabilityPct(0, 1561, 2031)).toBe(470);
  });

  it('template consumed', () => {
    expect(templateConsumed()).toBe(true);
  });
});
