import { describe, it, expect } from 'vitest';
import { comparatorSignal, turnPage, ejectBook, placeBook } from './lectern_signal';

describe('lectern signal', () => {
  it('no book zero signal', () => {
    expect(comparatorSignal({ bookPresent: false, pageIndex: 0, pageCount: 0 })).toBe(0);
  });

  it('first page = 1', () => {
    expect(comparatorSignal({ bookPresent: true, pageIndex: 0, pageCount: 10 })).toBe(1);
  });

  it('last page == 15 (wiki: equal steps 1..15)', () => {
    expect(comparatorSignal({ bookPresent: true, pageIndex: 9, pageCount: 10 })).toBe(15);
  });

  it('intermediate pages match wiki formula 1 + floor(P/(N-1) * 14)', () => {
    // Wiki canonical for 4 pages: 1, 5, 10, 15.
    expect(comparatorSignal({ bookPresent: true, pageIndex: 0, pageCount: 4 })).toBe(1);
    expect(comparatorSignal({ bookPresent: true, pageIndex: 1, pageCount: 4 })).toBe(5);
    expect(comparatorSignal({ bookPresent: true, pageIndex: 2, pageCount: 4 })).toBe(10);
    expect(comparatorSignal({ bookPresent: true, pageIndex: 3, pageCount: 4 })).toBe(15);
  });

  it('turn page advances', () => {
    const s = turnPage({ bookPresent: true, pageIndex: 0, pageCount: 5 }, true);
    expect(s.pageIndex).toBe(1);
  });

  it('eject clears', () => {
    const s = ejectBook({ bookPresent: true, pageIndex: 2, pageCount: 5 });
    expect(s.bookPresent).toBe(false);
  });

  it('place book resets page', () => {
    const s = placeBook({ bookPresent: false, pageIndex: 0, pageCount: 0 }, 10);
    expect(s.pageCount).toBe(10);
  });
});
