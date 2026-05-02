import { describe, it, expect } from 'vitest';
import { setPage, sign, canEdit, copy, MAX_CHARS_PER_PAGE } from './written_book_sign';

describe('written book sign', () => {
  it('set page under limit', () => {
    const b = setPage({ title: null, author: null, pages: [], signed: false }, 0, 'hello');
    expect(b.pages[0]).toBe('hello');
  });

  it('truncates over JE 1023-char per-page limit (wiki)', () => {
    const long = 'x'.repeat(MAX_CHARS_PER_PAGE + 100);
    const b = setPage({ title: null, author: null, pages: [], signed: false }, 0, long);
    expect(b.pages[0]?.length).toBe(MAX_CHARS_PER_PAGE);
  });

  it('signed blocks edit', () => {
    let b = sign({ title: null, author: null, pages: [''], signed: false }, 'Title', 'Steve');
    b = setPage(b, 0, 'nope');
    expect(b.pages[0]).toBe('');
  });

  it('canEdit respects signed', () => {
    const b = sign({ title: null, author: null, pages: [], signed: false }, 'T', 'A');
    expect(canEdit(b)).toBe(false);
  });

  it('copy not allowed on generation 2', () => {
    const b = sign({ title: null, author: null, pages: [], signed: false }, 'T', 'A');
    expect(copy(b, 2)).toBeNull();
  });
});
