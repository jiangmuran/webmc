import { describe, it, expect } from 'vitest';
import { applyOffer, offerFor } from './enchantment-table';
import { hasEnchant, type Enchanted } from './enchantment';
import type { ItemDef } from './item';

function pick(): ItemDef {
  return {
    id: 1,
    name: 'webmc:iron_pickaxe',
    maxStack: 1,
    durability: 250,
    toolKind: 'pickaxe',
  };
}

describe('enchantment-table', () => {
  it('slot 0 is cheaper than slot 2', () => {
    const rng = (): number => 0.5;
    const a = offerFor({ def: pick(), bookshelfPower: 0, slotIndex: 0, rng });
    const c = offerFor({ def: pick(), bookshelfPower: 0, slotIndex: 2, rng });
    expect(a.xpLevelCost).toBeLessThan(c.xpLevelCost);
    expect(a.xpLevelActual).toBeLessThan(c.xpLevelActual);
  });

  it('more bookshelves → higher actual level', () => {
    const rng = (): number => 0.9;
    const low = offerFor({ def: pick(), bookshelfPower: 0, slotIndex: 2, rng });
    const high = offerFor({ def: pick(), bookshelfPower: 15, slotIndex: 2, rng });
    expect(high.xpLevelActual).toBeGreaterThanOrEqual(low.xpLevelActual);
  });

  it('slot index 2 charges 3 levels', () => {
    const rng = (): number => 0.5;
    const o = offerFor({ def: pick(), bookshelfPower: 10, slotIndex: 2, rng });
    expect(o.xpLevelCost).toBe(3);
    expect(o.lapisCost).toBe(3);
  });

  it('applyOffer attaches the enchantment', () => {
    const rng = (): number => 0.5;
    const stack: Enchanted = { itemId: 1, count: 1, damage: 0 };
    const offer = offerFor({ def: pick(), bookshelfPower: 10, slotIndex: 2, rng });
    const out = applyOffer(stack, offer);
    if (offer.enchant) {
      expect(hasEnchant(out, offer.enchant.id)).toBeGreaterThan(0);
    }
  });
});
