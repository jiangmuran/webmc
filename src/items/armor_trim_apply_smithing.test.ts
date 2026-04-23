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

  it('template kept', () => {
    expect(consumesTemplate()).toBe(false);
  });

  it('material consumed', () => {
    expect(consumesMaterial()).toBe(true);
  });
});
