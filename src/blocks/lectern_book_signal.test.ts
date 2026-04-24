import { describe, it, expect } from 'vitest';
import { comparatorSignal, isActive, nextPage } from './lectern_book_signal';

describe('lectern book signal', () => {
  it('empty lectern no signal', () => {
    expect(comparatorSignal({ hasBook: false, page: 0, totalPages: 0 })).toBe(0);
  });

  it('single page book full signal', () => {
    expect(comparatorSignal({ hasBook: true, page: 1, totalPages: 1 })).toBe(15);
  });

  it('first page of many low signal', () => {
    expect(comparatorSignal({ hasBook: true, page: 1, totalPages: 15 })).toBe(1);
  });

  it('last page full signal', () => {
    expect(comparatorSignal({ hasBook: true, page: 15, totalPages: 15 })).toBe(15);
  });

  it('active with book', () => {
    expect(isActive({ hasBook: true, page: 1, totalPages: 3 })).toBe(true);
  });

  it('nextPage advances', () => {
    expect(nextPage({ hasBook: true, page: 1, totalPages: 5 }).page).toBe(2);
  });

  it('nextPage caps at total', () => {
    expect(nextPage({ hasBook: true, page: 5, totalPages: 5 }).page).toBe(5);
  });
});
