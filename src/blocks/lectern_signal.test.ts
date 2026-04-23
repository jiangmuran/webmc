import { describe, it, expect } from 'vitest';
import { comparatorSignal, turnPage, ejectBook, placeBook } from './lectern_signal';

describe('lectern signal', () => {
  it('no book zero signal', () => {
    expect(comparatorSignal({ bookPresent: false, pageIndex: 0, pageCount: 0 })).toBe(0);
  });

  it('first page = 1', () => {
    expect(comparatorSignal({ bookPresent: true, pageIndex: 0, pageCount: 10 })).toBe(1);
  });

  it('last page max', () => {
    expect(comparatorSignal({ bookPresent: true, pageIndex: 9, pageCount: 10 })).toBeGreaterThan(1);
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
