import { describe, it, expect } from 'vitest';
import {
  makeBox,
  tryPlace,
  totalItems,
  comparatorOutput,
  isShulkerBoxItem,
  BOX_SIZE,
} from './shulker_box_contents';

describe('shulker box', () => {
  it('detects shulker items', () => {
    expect(isShulkerBoxItem('webmc:shulker_box')).toBe(true);
    expect(isShulkerBoxItem('webmc:red_shulker_box')).toBe(true);
    expect(isShulkerBoxItem('webmc:chest')).toBe(false);
  });

  it('cannot nest', () => {
    const b = makeBox();
    expect(tryPlace(b, 0, 'webmc:red_shulker_box', 1)).toBe(false);
  });

  it('places and stacks', () => {
    const b = makeBox();
    expect(tryPlace(b, 0, 'webmc:stone', 64)).toBe(true);
    expect(tryPlace(b, 0, 'webmc:stone', 1)).toBe(true);
    expect(b.slots[0]?.count).toBe(65);
  });

  it('totalItems sums', () => {
    const b = makeBox();
    tryPlace(b, 0, 'webmc:stone', 10);
    tryPlace(b, 1, 'webmc:dirt', 5);
    expect(totalItems(b)).toBe(15);
  });

  it('comparator fullness', () => {
    const b = makeBox();
    expect(comparatorOutput(b)).toBe(0);
    for (let i = 0; i < BOX_SIZE; i++) tryPlace(b, i, 'webmc:stone', 1);
    expect(comparatorOutput(b)).toBe(15);
  });
});
