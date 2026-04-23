import { describe, it, expect } from 'vitest';
import { pickBlock, activeItem, scrollSlot } from './pick_block';

function mk(): { slots: (string | null)[]; activeSlot: number } {
  return { slots: ['stone', null, 'dirt', null, null, null, null, null, null], activeSlot: 0 };
}

describe('pick block', () => {
  it('existing swaps active slot', () => {
    const r = pickBlock(mk(), 'dirt', false);
    expect(r.activeSlot).toBe(2);
  });

  it('creative puts in active slot', () => {
    const r = pickBlock(mk(), 'gold_ore', true);
    expect(r.slots[0]).toBe('gold_ore');
  });

  it('survival skip if missing', () => {
    const before = mk();
    const r = pickBlock(before, 'gold_ore', false);
    expect(r.slots[0]).toBe('stone');
  });

  it('active item', () => {
    const h = mk();
    expect(activeItem(h)).toBe('stone');
  });

  it('scroll wraps', () => {
    expect(scrollSlot(mk(), -1).activeSlot).toBe(8);
    const end: { slots: (string | null)[]; activeSlot: number } = { slots: [], activeSlot: 8 };
    expect(scrollSlot(end, 1).activeSlot).toBe(0);
  });
});
