import { describe, it, expect } from 'vitest';
import { makeLectern, placeBook, takeBook, nav, comparatorOutput } from './lectern_page';

describe('lectern', () => {
  it('place and take', () => {
    const l = makeLectern();
    expect(placeBook(l, 5)).toBe(true);
    expect(placeBook(l, 5)).toBe(false);
    expect(takeBook(l)?.pageCount).toBe(5);
    expect(l.book).toBeNull();
  });

  it('navigation', () => {
    const l = makeLectern();
    placeBook(l, 3);
    expect(nav(l, 'next')).toEqual({ changed: true, pulsed: true });
    expect(nav(l, 'next')).toEqual({ changed: true, pulsed: true });
    expect(nav(l, 'next')).toEqual({ changed: false, pulsed: false });
    expect(l.page).toBe(2);
    expect(nav(l, 'prev')).toEqual({ changed: true, pulsed: true });
  });

  it('comparator output by page', () => {
    const l = makeLectern();
    placeBook(l, 11);
    expect(comparatorOutput(l)).toBe(1);
    l.page = 10;
    expect(comparatorOutput(l)).toBe(15);
  });

  it('empty lectern 0', () => {
    const l = makeLectern();
    expect(comparatorOutput(l)).toBe(0);
  });

  it('1-page book outputs 15 (wiki: only page = last page)', () => {
    const l = makeLectern();
    placeBook(l, 1);
    expect(comparatorOutput(l)).toBe(15);
  });
});
