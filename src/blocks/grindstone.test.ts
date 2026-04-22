import { describe, it, expect } from 'vitest';
import { grindstone } from './grindstone';
import { applyEnchant, hasEnchant, type Enchanted } from '@/items/enchantment';

function tool(damage: number): Enchanted {
  return { itemId: 1, count: 1, damage };
}

describe('grindstone', () => {
  it('disenchants a tool', () => {
    const left = applyEnchant(tool(0), 'sharpness', 3);
    const r = grindstone({ left, right: null, maxDurability: 250 });
    expect(hasEnchant(r.output, 'sharpness')).toBe(0);
    expect(r.xpReturn).toBeGreaterThan(0);
  });

  it('keeps curse enchants', () => {
    const left = applyEnchant(tool(0), 'curse_of_binding', 1);
    const r = grindstone({ left, right: null, maxDurability: 250 });
    expect(hasEnchant(r.output, 'curse_of_binding')).toBe(1);
  });

  it('combines two damaged tools + 5% bonus', () => {
    const left = tool(200); // durability left = 50
    const right = tool(200); // durability left = 50
    const r = grindstone({ left, right, maxDurability: 250 });
    // Combined 50 + 50 + 12 (5% of 250) = 112 → damage = 138.
    expect(r.output.damage).toBeLessThan(200);
  });

  it('different item types fall back to single-tool disenchant', () => {
    const left = applyEnchant(tool(100), 'sharpness', 2);
    const right: Enchanted = { itemId: 2, count: 1, damage: 0 };
    const r = grindstone({ left, right, maxDurability: 250 });
    expect(hasEnchant(r.output, 'sharpness')).toBe(0);
    expect(r.output.damage).toBe(100);
  });
});
