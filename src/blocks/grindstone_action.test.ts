import { describe, it, expect } from 'vitest';
import { stripped, xpRefund, combineDurabilities } from './grindstone_action';

describe('grindstone action', () => {
  it('strips non-curses', () => {
    const item = {
      durability: 100,
      maxDurability: 250,
      enchantments: [
        { id: 'sharpness', level: 3 },
        { id: 'curse_of_vanishing', level: 1 },
      ],
    };
    const r = stripped({ leftItem: item, rightItem: null });
    expect(r?.enchantments.length).toBe(1);
    expect(r?.enchantments[0]?.id).toBe('curse_of_vanishing');
  });

  it('xp refund from enchant levels', () => {
    const item = {
      durability: 100,
      maxDurability: 250,
      enchantments: [{ id: 'sharpness', level: 3 }],
    };
    expect(xpRefund({ leftItem: item, rightItem: null })).toBe(3);
  });

  it('combined durability + 5% bonus', () => {
    expect(combineDurabilities(100, 100, 250)).toBe(212);
  });

  it('capped at max', () => {
    expect(combineDurabilities(200, 200, 250)).toBe(250);
  });
});
