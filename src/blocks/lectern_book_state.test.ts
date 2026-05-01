import { describe, it, expect } from 'vitest';
import {
  closeBook,
  comparatorSignal,
  makeLectern,
  openBook,
  placeBook,
  pulseAdvance,
  takeBook,
  turnPage,
} from './lectern_book_state';

describe('lectern', () => {
  it('place + take book', () => {
    const l = makeLectern();
    expect(placeBook(l, { bookItem: 'webmc:book', totalPages: 3 })).toBe(true);
    expect(takeBook(l)).toBe('webmc:book');
  });

  it('cannot stack two books', () => {
    const l = makeLectern();
    placeBook(l, { bookItem: 'webmc:book', totalPages: 3 });
    expect(placeBook(l, { bookItem: 'webmc:book', totalPages: 3 })).toBe(false);
  });

  it('open/close tracks readers', () => {
    const l = makeLectern();
    placeBook(l, { bookItem: 'webmc:book', totalPages: 3 });
    openBook(l, 'p1');
    expect(l.readers.has('p1')).toBe(true);
    closeBook(l, 'p1');
    expect(l.readers.has('p1')).toBe(false);
  });

  it('turnPage advances within bounds', () => {
    const l = makeLectern();
    placeBook(l, { bookItem: 'webmc:book', totalPages: 5 });
    turnPage(l, 2);
    expect(l.currentPage).toBe(2);
    turnPage(l, 100);
    expect(l.currentPage).toBe(4);
  });

  it('comparator = 0 empty, 1..15 with book', () => {
    const l = makeLectern();
    expect(comparatorSignal(l)).toBe(0);
    placeBook(l, { bookItem: 'webmc:book', totalPages: 3 });
    expect(comparatorSignal(l)).toBe(1);
    turnPage(l, 2);
    expect(comparatorSignal(l)).toBe(15);
  });

  it('pulse advance wraps', () => {
    const l = makeLectern();
    placeBook(l, { bookItem: 'webmc:book', totalPages: 3 });
    l.currentPage = 2;
    pulseAdvance(l);
    expect(l.currentPage).toBe(0);
  });

  it('1-page book outputs 15 per wiki (was 1)', () => {
    // Wiki minecraft.wiki/w/Lectern: a single-page book's only page
    // IS the last page → comparator emits 15. Sibling
    // lectern_book_signal.ts and lectern_eject_book.ts special-case
    // this; lectern_book_state.ts now matches.
    const l = makeLectern();
    placeBook(l, { bookItem: 'webmc:book', totalPages: 1 });
    expect(comparatorSignal(l)).toBe(15);
  });
});
