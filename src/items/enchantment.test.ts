import { describe, it, expect } from 'vitest';
import {
  applicableFor,
  applyEnchant,
  ENCHANTMENTS,
  hasEnchant,
  rollEnchantment,
  weaponDamageBonus,
  type Enchanted,
} from './enchantment';
import type { ItemDef } from './item';

function tool(name: string, kind?: ItemDef['toolKind']): ItemDef {
  return {
    id: 0,
    name,
    maxStack: 1,
    durability: 250,
    ...(kind !== undefined ? { toolKind: kind } : {}),
  };
}

describe('enchantment', () => {
  it('sharpness applies to sword/axe, not to pickaxe', () => {
    expect(ENCHANTMENTS['sharpness']?.appliesTo(tool('webmc:iron_sword', 'sword'))).toBe(true);
    expect(ENCHANTMENTS['sharpness']?.appliesTo(tool('webmc:iron_pickaxe', 'pickaxe'))).toBe(false);
  });

  it('efficiency applies to pickaxe/axe/shovel', () => {
    expect(ENCHANTMENTS['efficiency']?.appliesTo(tool('webmc:iron_pickaxe', 'pickaxe'))).toBe(true);
    expect(ENCHANTMENTS['efficiency']?.appliesTo(tool('webmc:iron_sword', 'sword'))).toBe(false);
  });

  it('applicableFor returns all enchants matching the def', () => {
    const sword = applicableFor(tool('webmc:iron_sword', 'sword'));
    const ids = sword.map((e) => e.id);
    expect(ids).toContain('sharpness');
    expect(ids).toContain('unbreaking');
    expect(ids).not.toContain('efficiency');
  });

  it('rollEnchantment respects maxLevel', () => {
    const d = tool('webmc:iron_pickaxe', 'pickaxe');
    const rolled = rollEnchantment(d, 99, () => 0.999);
    expect(rolled).not.toBeNull();
    const silk = ENCHANTMENTS['silk_touch'];
    if (silk) expect(rolled?.level).toBeLessThanOrEqual(silk.maxLevel);
  });

  it('applyEnchant attaches and tracks levels', () => {
    const stack: Enchanted = { itemId: 1, count: 1, damage: 0 };
    const enchanted = applyEnchant(stack, 'sharpness', 3);
    expect(hasEnchant(enchanted, 'sharpness')).toBe(3);
    const up = applyEnchant(enchanted, 'sharpness', 2);
    expect(hasEnchant(up, 'sharpness')).toBe(3); // new-is-lower: keep old
  });

  it('weaponDamageBonus scales with sharpness', () => {
    const base: Enchanted = { itemId: 1, count: 1, damage: 0 };
    expect(weaponDamageBonus(base)).toBe(0);
    expect(weaponDamageBonus(applyEnchant(base, 'sharpness', 1))).toBe(1.5);
    expect(weaponDamageBonus(applyEnchant(base, 'sharpness', 5))).toBe(3.5);
  });
});
