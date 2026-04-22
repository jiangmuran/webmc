import { describe, it, expect } from 'vitest';
import { bookTitleForUI, copyBook, MAX_TITLE_CHARS, readPage, signBook } from './written_book';

describe('written book', () => {
  it('signs a valid book', () => {
    const b = signBook({ title: 'Hi', author: 'me', pages: ['page one'] });
    expect(b).not.toBeNull();
    expect(b?.generation).toBe(0);
  });

  it('rejects too-long title', () => {
    expect(
      signBook({
        title: 'x'.repeat(MAX_TITLE_CHARS + 1),
        author: 'a',
        pages: [],
      }),
    ).toBeNull();
  });

  it('copy increments generation', () => {
    const b = signBook({ title: 'Hi', author: 'me', pages: [] });
    if (!b) throw new Error();
    const c1 = copyBook(b);
    if (!c1) throw new Error();
    expect(c1.generation).toBe(1);
    const c2 = copyBook(c1);
    if (!c2) throw new Error();
    expect(c2.generation).toBe(2);
    expect(copyBook(c2)).toBeNull();
  });

  it('readPage returns content', () => {
    const b = signBook({ title: 'X', author: 'me', pages: ['a', 'b'] });
    if (!b) throw new Error();
    expect(readPage(b, 1)).toBe('b');
    expect(readPage(b, 99)).toBeNull();
  });

  it('UI title reflects generation', () => {
    const b = signBook({ title: 'Foo', author: 'me', pages: [] });
    if (!b) throw new Error();
    expect(bookTitleForUI(b)).toBe('Foo');
    const c = copyBook(b);
    if (!c) throw new Error();
    expect(bookTitleForUI(c)).toContain('Copy of');
  });
});
