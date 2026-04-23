import { describe, it, expect } from 'vitest';
import { netheriteResult, isTrimTemplate, NETHERITE_TEMPLATE } from './smithing_netherite_upgrade';

describe('smithing netherite upgrade', () => {
  it('diamond sword → netherite', () => {
    expect(
      netheriteResult({
        template: NETHERITE_TEMPLATE,
        base: 'diamond_sword',
        addition: 'netherite_ingot',
      }),
    ).toBe('netherite_sword');
  });

  it('wrong template nothing', () => {
    expect(
      netheriteResult({
        template: 'rib_armor_trim',
        base: 'diamond_sword',
        addition: 'netherite_ingot',
      }),
    ).toBeUndefined();
  });

  it('wrong base nothing', () => {
    expect(
      netheriteResult({
        template: NETHERITE_TEMPLATE,
        base: 'iron_sword',
        addition: 'netherite_ingot',
      }),
    ).toBeUndefined();
  });

  it('wrong addition nothing', () => {
    expect(
      netheriteResult({
        template: NETHERITE_TEMPLATE,
        base: 'diamond_helmet',
        addition: 'iron_ingot',
      }),
    ).toBeUndefined();
  });

  it('trim templates recognized', () => {
    expect(isTrimTemplate('dune_armor_trim')).toBe(true);
    expect(isTrimTemplate(NETHERITE_TEMPLATE)).toBe(false);
  });
});
