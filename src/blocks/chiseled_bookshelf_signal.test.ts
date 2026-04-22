import { describe, it, expect } from 'vitest';
import { makeBookshelf, placeBook, takeBook, comparatorSignal } from './chiseled_bookshelf_signal';

describe('chiseled bookshelf signal', () => {
  it('empty signal 0', () => {
    expect(comparatorSignal(makeBookshelf())).toBe(0);
  });

  it('signal = slot+1 after place', () => {
    const b = makeBookshelf();
    placeBook(b, 2, 'book');
    expect(comparatorSignal(b)).toBe(3);
  });

  it('signal updates on take', () => {
    const b = makeBookshelf();
    placeBook(b, 0, 'book');
    placeBook(b, 5, 'book');
    takeBook(b, 0);
    expect(comparatorSignal(b)).toBe(1);
  });

  it('refuses occupied slot', () => {
    const b = makeBookshelf();
    placeBook(b, 0, 'a');
    expect(placeBook(b, 0, 'b')).toBe(false);
  });

  it('take returns book', () => {
    const b = makeBookshelf();
    placeBook(b, 1, 'atlas');
    expect(takeBook(b, 1)).toBe('atlas');
    expect(takeBook(b, 1)).toBe(null);
  });
});
