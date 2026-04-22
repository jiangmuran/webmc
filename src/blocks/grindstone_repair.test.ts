import { describe, it, expect } from 'vitest';
import { combine, type ToolItem } from './grindstone_repair';

function tool(damage: number, enchants: ToolItem['enchantments'] = []): ToolItem {
  return { id: 'webmc:iron_pickaxe', damage, maxDurability: 250, enchantments: enchants };
}

describe('grindstone', () => {
  it('repair with bonus', () => {
    const a = tool(100);
    const b = tool(100);
    const r = combine({ a, b });
    expect(r.output).not.toBeNull();
    // dur left: 150 + 150 = 300 + 12 bonus = clamped to 250 max
    expect(r.output?.damage).toBe(0);
  });

  it('different types fail', () => {
    const a = tool(100);
    const b: ToolItem = { ...tool(100), id: 'webmc:gold_pickaxe' };
    expect(combine({ a, b }).output).toBeNull();
  });

  it('removes enchantments with xp', () => {
    const a = tool(50, [
      { id: 'webmc:efficiency', level: 3 },
      { id: 'webmc:binding_curse', level: 1 },
    ]);
    const r = combine({ a, b: null });
    expect(r.xpDropped).toBe(1);
    expect(r.output?.enchantments.map((e) => e.id)).toEqual(['webmc:binding_curse']);
  });

  it('both null = null', () => {
    expect(combine({ a: null, b: null }).output).toBeNull();
  });
});
