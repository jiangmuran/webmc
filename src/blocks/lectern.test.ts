import { describe, it, expect } from 'vitest';
import {
  comparatorSignal,
  ejectBook,
  insertBook,
  makeLectern,
  nextPage,
  prevPage,
} from './lectern';

const BOOK = { title: 'Guide', author: 'Alice', pages: ['p1', 'p2', 'p3', 'p4'] };

describe('lectern', () => {
  it('insert + eject round-trips a book', () => {
    const l = makeLectern();
    expect(insertBook(l, BOOK)).toBe(true);
    const out = ejectBook(l);
    expect(out?.title).toBe('Guide');
    expect(l.book).toBeNull();
  });

  it('refuses inserting a second book', () => {
    const l = makeLectern();
    insertBook(l, BOOK);
    expect(insertBook(l, BOOK)).toBe(false);
  });

  it('page navigation respects bounds', () => {
    const l = makeLectern();
    insertBook(l, BOOK);
    expect(prevPage(l)).toBe(false); // already on first
    expect(nextPage(l)).toBe(true);
    expect(l.currentPage).toBe(1);
    nextPage(l);
    nextPage(l);
    expect(nextPage(l)).toBe(false); // on last
    expect(prevPage(l)).toBe(true);
  });

  it('comparator signal scales with page number', () => {
    const l = makeLectern();
    insertBook(l, BOOK);
    const first = comparatorSignal(l);
    nextPage(l);
    nextPage(l);
    nextPage(l);
    const last = comparatorSignal(l);
    expect(last).toBeGreaterThan(first);
    expect(last).toBeLessThanOrEqual(15);
  });

  it('empty lectern signals 0', () => {
    const l = makeLectern();
    expect(comparatorSignal(l)).toBe(0);
  });
});
