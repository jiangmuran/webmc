import { describe, it, expect } from 'vitest';
import { applyEnchant, type Enchanted } from './enchantment';
import { fallDamage } from './feather_falling';

const plain: Enchanted = { itemId: 1, count: 1, damage: 0 };

describe('feather falling', () => {
  it('3 block fall = 0 damage', () => {
    expect(
      fallDamage({
        fallDistance: 3,
        boots: plain,
        slowFallingEffect: false,
      }),
    ).toBe(0);
  });

  it('10 block fall = 7 damage unarmored', () => {
    expect(
      fallDamage({
        fallDistance: 10,
        boots: plain,
        slowFallingEffect: false,
      }),
    ).toBe(7);
  });

  it('feather falling reduces fall damage', () => {
    const ff = applyEnchant(plain, 'feather_falling', 4);
    const out = fallDamage({
      fallDistance: 10,
      boots: ff,
      slowFallingEffect: false,
    });
    expect(out).toBeLessThan(7);
  });

  it('slow falling effect negates all fall damage', () => {
    expect(
      fallDamage({
        fallDistance: 100,
        boots: plain,
        slowFallingEffect: true,
      }),
    ).toBe(0);
  });
});
