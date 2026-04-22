import { describe, it, expect } from 'vitest';
import { makeHotbar, scroll, selectSlot, pickBlock } from './hotbar_scroll';

describe('hotbar', () => {
  it('scroll wraps', () => {
    const s = makeHotbar();
    scroll(s, 1);
    expect(s.selected).toBe(1);
    s.selected = 8;
    scroll(s, 1);
    expect(s.selected).toBe(0);
    scroll(s, -1);
    expect(s.selected).toBe(8);
  });

  it('select slot 0..8', () => {
    const s = makeHotbar();
    expect(selectSlot(s, 5)).toBe(true);
    expect(s.selected).toBe(5);
    expect(selectSlot(s, 9)).toBe(false);
  });

  it('pick block: existing in hotbar', () => {
    const s = makeHotbar();
    const hot: (string | null)[] = [null, null, 'webmc:stone', null, null, null, null, null, null];
    const r = pickBlock(s, { targetItemId: 'webmc:stone', hotbar: hot }, false);
    expect(r.newSelectedIndex).toBe(2);
    expect(s.selected).toBe(2);
  });

  it('pick block: creative creates', () => {
    const s = makeHotbar();
    const hot: (string | null)[] = [null, null, null, null, null, null, null, null, null];
    const r = pickBlock(s, { targetItemId: 'webmc:stone', hotbar: hot }, true);
    expect(r.createdInCreative).toBe(true);
    expect(hot[0]).toBe('webmc:stone');
  });

  it('pick block: survival + missing = no-op', () => {
    const s = makeHotbar();
    const hot: (string | null)[] = [null, null, null, null, null, null, null, null, null];
    const r = pickBlock(s, { targetItemId: 'webmc:stone', hotbar: hot }, false);
    expect(r.createdInCreative).toBe(false);
    expect(hot[0]).toBeNull();
  });
});
