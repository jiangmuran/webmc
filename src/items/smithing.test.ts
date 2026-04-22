import { describe, it, expect } from 'vitest';
import { applySmithing, netheriteUpgradeFor } from './smithing';
import { applyEnchant } from './enchantment';

describe('smithing — netherite upgrade', () => {
  it('diamond_pickaxe → netherite_pickaxe', () => {
    expect(netheriteUpgradeFor('webmc:diamond_pickaxe')).toBe('webmc:netherite_pickaxe');
  });

  it('unknown tool returns null', () => {
    expect(netheriteUpgradeFor('webmc:apple')).toBeNull();
  });

  it('upgrade preserves enchantments', () => {
    const tool = applyEnchant({ itemId: 1, count: 1, damage: 0 }, 'sharpness', 3);
    const r = applySmithing({
      template: 'netherite_upgrade',
      tool,
      toolName: 'webmc:diamond_sword',
      ingredientName: 'webmc:netherite_ingot',
    });
    expect(r?.outputName).toBe('webmc:netherite_sword');
    expect(r?.enchants?.get('sharpness')).toBe(3);
  });

  it('wrong ingredient fails upgrade', () => {
    const r = applySmithing({
      template: 'netherite_upgrade',
      tool: { itemId: 1, count: 1, damage: 0 },
      toolName: 'webmc:diamond_sword',
      ingredientName: 'webmc:iron_ingot',
    });
    expect(r).toBeNull();
  });
});

describe('smithing — trim application', () => {
  it('coast_trim + copper → trim output', () => {
    const r = applySmithing({
      template: 'coast_trim',
      tool: { itemId: 1, count: 1, damage: 0 },
      toolName: 'webmc:iron_chestplate',
      ingredientName: 'webmc:copper_ingot',
    });
    expect(r?.trim?.pattern).toBe('coast');
    expect(r?.trim?.material).toBe('copper');
    // Output name unchanged for trims.
    expect(r?.outputName).toBe('webmc:iron_chestplate');
  });

  it('unknown ingredient material returns null', () => {
    const r = applySmithing({
      template: 'vex_trim',
      tool: { itemId: 1, count: 1, damage: 0 },
      toolName: 'webmc:iron_chestplate',
      ingredientName: 'webmc:apple',
    });
    expect(r).toBeNull();
  });
});
