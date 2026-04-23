import { describe, it, expect } from 'vitest';
import { build } from './item_tooltip';

describe('item tooltip', () => {
  it('only display name', () => {
    const r = build({
      displayName: 'Iron Sword',
      customName: null,
      enchantments: [],
      durability: null,
      lore: [],
      advancedTooltips: false,
    });
    expect(r.length).toBe(1);
    expect(r[0]?.text).toBe('Iron Sword');
  });

  it('custom name italic first', () => {
    const r = build({
      displayName: 'Iron Sword',
      customName: 'Excalibur',
      enchantments: [],
      durability: null,
      lore: [],
      advancedTooltips: false,
    });
    expect(r[0]).toEqual({ text: 'Excalibur', style: 'italic' });
  });

  it('enchants as gray roman', () => {
    const r = build({
      displayName: 'Bow',
      customName: null,
      enchantments: [{ id: 'power', level: 5 }],
      durability: null,
      lore: [],
      advancedTooltips: false,
    });
    expect(r.find((l) => l.text.includes('V'))).toBeDefined();
  });

  it('durability line', () => {
    const r = build({
      displayName: 'Pickaxe',
      customName: null,
      enchantments: [],
      durability: { current: 100, max: 250 },
      lore: [],
      advancedTooltips: false,
    });
    expect(r.find((l) => l.text.includes('Durability'))).toBeDefined();
  });

  it('advanced shows block id', () => {
    const r = build({
      displayName: 'Stone',
      customName: null,
      enchantments: [],
      durability: null,
      lore: [],
      blockId: 'minecraft:stone',
      advancedTooltips: true,
    });
    expect(r.find((l) => l.text.includes('minecraft:stone'))).toBeDefined();
  });
});
