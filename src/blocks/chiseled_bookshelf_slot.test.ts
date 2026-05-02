import { describe, it, expect } from 'vitest';
import {
  breakBookshelf,
  comparatorSignal,
  enchantmentPower,
  interactSlot,
  makeBookshelf,
} from './chiseled_bookshelf_slot';

describe('chiseled bookshelf', () => {
  it('6 empty slots', () => {
    expect(makeBookshelf().slots.length).toBe(6);
  });

  it('insert + extract', () => {
    const b = makeBookshelf();
    const ins = interactSlot(b, { slot: 2, holdingBook: 'webmc:book' });
    expect(ins.kind).toBe('inserted');
    const ext = interactSlot(b, { slot: 2, holdingBook: null });
    expect(ext.kind).toBe('extracted');
  });

  it('comparator tracks last slot', () => {
    const b = makeBookshelf();
    expect(comparatorSignal(b)).toBe(0);
    interactSlot(b, { slot: 3, holdingBook: 'webmc:book' });
    expect(comparatorSignal(b)).toBe(4);
  });

  it('chiseled bookshelf gives 0 enchant power (wiki)', () => {
    // Wiki: "Chiseled bookshelves do not increase the power of
    // enchanting tables." 0 regardless of how many books fill it.
    const b = makeBookshelf();
    expect(enchantmentPower(b)).toBe(0);
    interactSlot(b, { slot: 0, holdingBook: 'webmc:book' });
    interactSlot(b, { slot: 1, holdingBook: 'webmc:book' });
    expect(enchantmentPower(b)).toBe(0);
  });

  it('out-of-range slot = no change', () => {
    const b = makeBookshelf();
    expect(interactSlot(b, { slot: 10, holdingBook: 'webmc:book' }).kind).toBe('no_change');
  });

  it('break drops books + bookshelf', () => {
    const b = makeBookshelf();
    interactSlot(b, { slot: 0, holdingBook: 'webmc:book' });
    interactSlot(b, { slot: 3, holdingBook: 'webmc:enchanted_book' });
    const drops = breakBookshelf(b);
    expect(drops.length).toBe(3);
  });
});
