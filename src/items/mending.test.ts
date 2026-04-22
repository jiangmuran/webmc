import { describe, it, expect } from 'vitest';
import { applyEnchant, type Enchanted } from './enchantment';
import { mendWithXpOrb, pickMendingTarget } from './mending';

function mendingTool(damage: number): Enchanted {
  const base: Enchanted = { itemId: 1, count: 1, damage };
  return applyEnchant(base, 'mending', 1);
}

describe('mending', () => {
  it('picks first damaged mending item', () => {
    const t = pickMendingTarget([
      { stack: { itemId: 1, count: 1, damage: 0 }, maxDurability: 100 },
      { stack: mendingTool(50), maxDurability: 100 },
    ]);
    expect(t?.stack.damage).toBe(50);
  });

  it('no damaged mending → null', () => {
    const t = pickMendingTarget([{ stack: mendingTool(0), maxDurability: 100 }]);
    expect(t).toBeNull();
  });

  it('xp orb repairs item', () => {
    const carrier = { stack: mendingTool(20), maxDurability: 100 };
    const r = mendWithXpOrb(carrier, 5);
    expect(r.repaired).toBe(10);
    expect(r.xpConsumed).toBe(5);
    expect(carrier.stack.damage).toBe(10);
  });

  it('xp leftover when repair completes', () => {
    const carrier = { stack: mendingTool(4), maxDurability: 100 };
    const r = mendWithXpOrb(carrier, 10);
    expect(r.repaired).toBe(4);
    expect(r.xpLeftover).toBe(8);
  });

  it('null target → xp goes entirely to player bar', () => {
    const r = mendWithXpOrb(null, 7);
    expect(r.xpLeftover).toBe(7);
    expect(r.repaired).toBe(0);
  });
});
