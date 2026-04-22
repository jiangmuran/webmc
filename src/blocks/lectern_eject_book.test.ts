import { describe, it, expect } from 'vitest';
import {
  makeLectern,
  insertBook,
  removeBook,
  turnPage,
  comparatorOutput,
} from './lectern_eject_book';

describe('lectern eject', () => {
  it('insert once', () => {
    const l = makeLectern();
    expect(insertBook(l, { pageCount: 3, title: 'Tales' })).toBe(true);
    expect(insertBook(l, { pageCount: 2, title: 'Other' })).toBe(false);
  });

  it('remove returns book', () => {
    const l = makeLectern();
    insertBook(l, { pageCount: 3, title: 'T' });
    expect(removeBook(l)?.title).toBe('T');
    expect(l.book).toBeNull();
  });

  it('turn page', () => {
    const l = makeLectern();
    insertBook(l, { pageCount: 5, title: 't' });
    expect(turnPage(l, 2, 100)).toBe(true);
    expect(l.currentPage).toBe(2);
    expect(turnPage(l, 20, 101)).toBe(true);
    expect(l.currentPage).toBe(4);
  });

  it('comparator output scales', () => {
    const l = makeLectern();
    insertBook(l, { pageCount: 11, title: 't' });
    expect(comparatorOutput(l)).toBe(1);
    l.currentPage = 10;
    expect(comparatorOutput(l)).toBe(15);
  });

  it('empty = 0', () => {
    const l = makeLectern();
    expect(comparatorOutput(l)).toBe(0);
  });
});
