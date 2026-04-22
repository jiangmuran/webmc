import { describe, it, expect } from 'vitest';
import {
  makeAllay,
  giveItem,
  takeItem,
  bindToNoteblock,
  shouldPickup,
  dropTarget,
} from './allay_item_follow';

describe('allay item follow', () => {
  it('give and take', () => {
    const a = makeAllay();
    expect(giveItem(a, 'p', 'webmc:cobblestone')).toBe(true);
    expect(giveItem(a, 'p', 'webmc:stone')).toBe(false);
    expect(takeItem(a)).toBe('webmc:cobblestone');
  });

  it('pickup matches held', () => {
    const a = makeAllay();
    giveItem(a, 'p', 'webmc:cobblestone');
    expect(shouldPickup(a, { groundItemId: 'webmc:cobblestone' })).toBe(true);
    expect(shouldPickup(a, { groundItemId: 'webmc:stone' })).toBe(false);
  });

  it('empty allay never picks up', () => {
    const a = makeAllay();
    expect(shouldPickup(a, { groundItemId: 'webmc:cobblestone' })).toBe(false);
  });

  it('bind requires item', () => {
    const a = makeAllay();
    expect(bindToNoteblock(a, { x: 0, y: 0, z: 0 })).toBe(false);
    giveItem(a, 'p', 'x');
    expect(bindToNoteblock(a, { x: 1, y: 2, z: 3 })).toBe(true);
    expect(dropTarget(a)).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('owner fallback', () => {
    const a = makeAllay();
    giveItem(a, 'p', 'x');
    expect(dropTarget(a)).toBe('owner');
  });
});
