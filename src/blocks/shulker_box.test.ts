import { describe, it, expect } from 'vitest';
import { depositToBox, dyeBox, isNestingAttempt, makeShulkerBox, takeFromBox } from './shulker_box';

describe('shulker box', () => {
  it('starts empty', () => {
    const s = makeShulkerBox();
    expect(s.inventory.size).toBe(27);
  });

  it('deposits + withdraws items', () => {
    const s = makeShulkerBox();
    depositToBox(s, { itemId: 5, count: 10, damage: 0 });
    const out = takeFromBox(s, 5, 0, 3);
    expect(out?.count).toBe(3);
  });

  it('dye changes color', () => {
    const s = makeShulkerBox('plain');
    dyeBox(s, 'red');
    expect(s.color).toBe('red');
  });

  it('prevents nesting shulker-in-shulker', () => {
    const shulkerIds = new Set([10, 11, 12]);
    expect(isNestingAttempt({ itemId: 10, count: 1, damage: 0 }, (id) => shulkerIds.has(id))).toBe(
      true,
    );
    expect(isNestingAttempt({ itemId: 5, count: 1, damage: 0 }, (id) => shulkerIds.has(id))).toBe(
      false,
    );
  });
});
