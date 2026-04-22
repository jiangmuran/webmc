import { describe, it, expect } from 'vitest';
import { combineEnchants, ENCHANT_MAX } from './anvil_enchant_combine';

describe('anvil enchant combine', () => {
  it('adds new enchantment', () => {
    const r = combineEnchants({
      tool: { enchantments: [], priorWorkCost: 0 },
      bookEnchants: [{ id: 'sharpness', level: 3 }],
    });
    expect(r.mergedEnchants.find((e) => e.id === 'sharpness')?.level).toBe(3);
  });

  it('same level combines up', () => {
    const r = combineEnchants({
      tool: { enchantments: [{ id: 'sharpness', level: 3 }], priorWorkCost: 0 },
      bookEnchants: [{ id: 'sharpness', level: 3 }],
    });
    expect(r.mergedEnchants.find((e) => e.id === 'sharpness')?.level).toBe(4);
  });

  it('caps at max', () => {
    const r = combineEnchants({
      tool: {
        enchantments: [{ id: 'sharpness', level: ENCHANT_MAX['sharpness'] ?? 5 }],
        priorWorkCost: 0,
      },
      bookEnchants: [{ id: 'sharpness', level: ENCHANT_MAX['sharpness'] ?? 5 }],
    });
    expect(r.mergedEnchants.find((e) => e.id === 'sharpness')?.level).toBe(
      ENCHANT_MAX['sharpness'],
    );
  });

  it('prior work doubles cost', () => {
    const r1 = combineEnchants({
      tool: { enchantments: [], priorWorkCost: 0 },
      bookEnchants: [{ id: 'sharpness', level: 3 }],
    });
    const r2 = combineEnchants({
      tool: { enchantments: [], priorWorkCost: 3 },
      bookEnchants: [{ id: 'sharpness', level: 3 }],
    });
    expect(r2.xpCost).toBeGreaterThan(r1.xpCost);
  });
});
