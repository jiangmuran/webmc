import { describe, it, expect } from 'vitest';
import { swapHotbarSlot, swapFromMain, HOTBAR_SIZE } from './inventory_hotbar_swap';

const inv = {
  hotbar: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'] as (string | null)[],
  main: [['x', 'y', 'z']] as (string | null)[][],
};

describe('inventory hotbar swap', () => {
  it('swap two slots', () => {
    const r = swapHotbarSlot(inv, 0, 8);
    expect(r.hotbar[0]).toBe('i');
    expect(r.hotbar[8]).toBe('a');
  });

  it('out-of-range no-op', () => {
    expect(swapHotbarSlot(inv, -1, 0)).toEqual(inv);
    expect(swapHotbarSlot(inv, 0, HOTBAR_SIZE)).toEqual(inv);
  });

  it('swap with main grid', () => {
    const r = swapFromMain(inv, 0, 0, 1);
    expect(r.hotbar[0]).toBe('y');
    expect(r.main[0]?.[1]).toBe('a');
  });
});
