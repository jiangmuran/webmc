import { describe, it, expect } from 'vitest';
import { reducedDamage, armorDurabilityCost, toughnessOf } from './armor_damage_formula';

describe('armor damage formula', () => {
  it('no armor no reduction', () => {
    expect(reducedDamage(10, 0, 0)).toBe(10);
  });

  it('armor reduces', () => {
    expect(reducedDamage(10, 20, 0)).toBeLessThan(10);
  });

  it('more toughness reduces more', () => {
    expect(reducedDamage(30, 20, 3)).toBeLessThan(reducedDamage(30, 20, 0));
  });

  it('durability cost at least 1', () => {
    expect(armorDurabilityCost(0.5)).toBe(1);
  });

  it('durability scales', () => {
    expect(armorDurabilityCost(16)).toBe(4);
  });

  it('netherite toughness 3', () => {
    expect(toughnessOf('netherite_chestplate')).toBe(3);
  });

  it('iron toughness 0', () => {
    expect(toughnessOf('iron_chestplate')).toBe(0);
  });
});
