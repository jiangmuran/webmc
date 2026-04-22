import { describe, it, expect } from 'vitest';
import { newInventory, setSlot, countEmpty, drops, ENDER_CHEST_SIZE } from './ender_chest_keyed';

describe('ender chest keyed', () => {
  it('27 slots', () => {
    expect(ENDER_CHEST_SIZE).toBe(27);
    expect(newInventory('p').slots.length).toBe(27);
  });

  it('set slot valid', () => {
    const inv = newInventory('p');
    expect(setSlot(inv, 0, 'stone')).toBe(true);
    expect(inv.slots[0]).toBe('stone');
  });

  it('reject oob', () => {
    const inv = newInventory('p');
    expect(setSlot(inv, 100, 'stone')).toBe(false);
  });

  it('count empty', () => {
    const inv = newInventory('p');
    setSlot(inv, 0, 'a');
    setSlot(inv, 1, 'b');
    expect(countEmpty(inv)).toBe(25);
  });

  it('silk touch drops chest', () => {
    expect(drops(true)).toEqual(['ender_chest']);
  });

  it('no silk drops obsidian 8x', () => {
    const d = drops(false);
    expect(d.length).toBe(8);
    for (const x of d) expect(x).toBe('obsidian');
  });
});
