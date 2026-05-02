import { describe, it, expect } from 'vitest';
import { canApply, consumesTemplate, consumesMaterial } from './armor_trim_apply_smithing';

describe('armor trim smithing', () => {
  it('valid combo', () => {
    expect(canApply({ base: 'iron_chestplate', template: 'dune', material: 'gold' })).toBe(true);
  });

  it('unknown template', () => {
    expect(canApply({ base: 'iron_chestplate', template: 'xyz', material: 'gold' })).toBe(false);
  });

  it('non-material fails', () => {
    expect(canApply({ base: 'iron_chestplate', template: 'dune', material: 'stick' })).toBe(false);
  });

  it('template consumed (wiki)', () => {
    // Wiki (minecraft.wiki/w/Smithing_Template): "The smithing
    // template is consumed when used to apply a trim or upgrade an
    // armor piece." Old contract had `consumesTemplate=false`,
    // letting players permanently keep a single Snout trim.
    expect(consumesTemplate()).toBe(true);
  });

  it('material consumed', () => {
    expect(consumesMaterial()).toBe(true);
  });

  it('1.20 trail ruins + 1.21 trial chamber templates valid', () => {
    for (const tpl of ['wayfinder', 'shaper', 'silence', 'raiser', 'host', 'flow', 'bolt']) {
      expect(canApply({ base: 'iron_chestplate', template: tpl, material: 'gold' })).toBe(true);
    }
  });

  it('resin (1.21.4 pale-garden) is a trim material', () => {
    expect(canApply({ base: 'iron_chestplate', template: 'dune', material: 'resin' })).toBe(true);
  });
});
