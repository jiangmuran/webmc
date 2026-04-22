import { describe, it, expect } from 'vitest';
import {
  addPage,
  editPage,
  inkUnitsForEdit,
  makeWritableBook,
  MAX_CHARS_PER_PAGE,
  MAX_PAGES,
  removePage,
  swapPages,
} from './book_and_quill';

describe('book and quill', () => {
  it('adds a new page', () => {
    const b = makeWritableBook();
    const r = editPage(b, { pageIndex: 0, text: 'hello' });
    expect(r.accepted).toBe(true);
    expect(b.pages[0]).toBe('hello');
  });

  it('truncates overlong', () => {
    const b = makeWritableBook();
    const long = 'x'.repeat(MAX_CHARS_PER_PAGE + 100);
    const r = editPage(b, { pageIndex: 0, text: long });
    expect(r.truncated).toBe(true);
    expect(b.pages[0]?.length).toBe(MAX_CHARS_PER_PAGE);
  });

  it('rejects gap write', () => {
    const b = makeWritableBook();
    expect(editPage(b, { pageIndex: 5, text: 'hi' }).accepted).toBe(false);
  });

  it('addPage blank', () => {
    const b = makeWritableBook();
    addPage(b);
    expect(b.pages.length).toBe(1);
  });

  it('MAX_PAGES cap', () => {
    const b = makeWritableBook();
    for (let i = 0; i < MAX_PAGES; i++) addPage(b);
    expect(addPage(b)).toBe(false);
  });

  it('removePage', () => {
    const b = makeWritableBook();
    addPage(b);
    addPage(b);
    removePage(b, 0);
    expect(b.pages.length).toBe(1);
  });

  it('swapPages', () => {
    const b = makeWritableBook();
    editPage(b, { pageIndex: 0, text: 'A' });
    editPage(b, { pageIndex: 1, text: 'B' });
    swapPages(b, 0, 1);
    expect(b.pages).toEqual(['B', 'A']);
  });

  it('ink units', () => {
    expect(inkUnitsForEdit('hello')).toBe(1);
    expect(inkUnitsForEdit('hello world!')).toBe(3);
  });
});
