import { describe, it, expect } from 'vitest';
import { makeHotbar, scrollSelect, selectedItem, selectSlot, setSlot, swap } from './hotbar';

describe('hotbar', () => {
  it('starts with 9 empty slots at 0', () => {
    const h = makeHotbar();
    expect(h.slots.length).toBe(9);
    expect(h.selected).toBe(0);
  });

  it('select slot in range', () => {
    const h = makeHotbar();
    expect(selectSlot(h, 5)).toBe(true);
    expect(h.selected).toBe(5);
  });

  it('reject out-of-range select', () => {
    const h = makeHotbar();
    expect(selectSlot(h, 10)).toBe(false);
  });

  it('scroll wraps forward', () => {
    const h = makeHotbar();
    h.selected = 8;
    scrollSelect(h, 1);
    expect(h.selected).toBe(0);
  });

  it('scroll wraps backward', () => {
    const h = makeHotbar();
    scrollSelect(h, -1);
    expect(h.selected).toBe(8);
  });

  it('setSlot + selectedItem', () => {
    const h = makeHotbar();
    setSlot(h, 3, 'webmc:pickaxe');
    selectSlot(h, 3);
    expect(selectedItem(h)).toBe('webmc:pickaxe');
  });

  it('swap exchanges two slots', () => {
    const h = makeHotbar();
    setSlot(h, 0, 'webmc:a');
    setSlot(h, 4, 'webmc:b');
    swap(h, 0, 4);
    expect(h.slots[0]).toBe('webmc:b');
    expect(h.slots[4]).toBe('webmc:a');
  });

  it('swap out of range fails', () => {
    const h = makeHotbar();
    expect(swap(h, -1, 4)).toBe(false);
  });
});
