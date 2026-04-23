import { describe, it, expect } from 'vitest';
import { apply } from './enchant_book_apply_anvil';

describe('enchant book apply anvil', () => {
  it('compatible enchant added', () => {
    const r = apply({
      bookEnchants: [{ id: 'sharpness', level: 3 }],
      targetCompatible: new Set(['sharpness']),
      targetExisting: {},
      maxLevelCaps: { sharpness: 5 },
    });
    expect(r.enchants['sharpness']).toBe(3);
  });

  it('incompatible skipped', () => {
    const r = apply({
      bookEnchants: [{ id: 'silk_touch', level: 1 }],
      targetCompatible: new Set(['sharpness']),
      targetExisting: {},
      maxLevelCaps: {},
    });
    expect(r.enchants['silk_touch']).toBeUndefined();
  });

  it('same-level combines into +1', () => {
    const r = apply({
      bookEnchants: [{ id: 'sharpness', level: 3 }],
      targetCompatible: new Set(['sharpness']),
      targetExisting: { sharpness: 3 },
      maxLevelCaps: { sharpness: 5 },
    });
    expect(r.enchants['sharpness']).toBe(4);
  });

  it('caps at max', () => {
    const r = apply({
      bookEnchants: [{ id: 'sharpness', level: 5 }],
      targetCompatible: new Set(['sharpness']),
      targetExisting: { sharpness: 5 },
      maxLevelCaps: { sharpness: 5 },
    });
    expect(r.enchants['sharpness']).toBe(5);
  });
});
