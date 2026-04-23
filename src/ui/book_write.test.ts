import { describe, it, expect } from 'vitest';
import {
  addPage,
  sign,
  isEditable,
  MAX_PAGES,
  MAX_CHARS_PER_PAGE,
  MAX_TITLE_LENGTH,
} from './book_write';

describe('book write', () => {
  it('adds a page', () => {
    const b = addPage({ pages: [] }, 'hello');
    expect(b.pages).toHaveLength(1);
  });

  it('truncates page', () => {
    const b = addPage({ pages: [] }, 'x'.repeat(5000));
    expect(b.pages[0]?.length).toBe(MAX_CHARS_PER_PAGE);
  });

  it('caps at max pages', () => {
    let b: { pages: string[] } = { pages: [] };
    for (let i = 0; i < MAX_PAGES + 5; i++) b = addPage(b, 'p');
    expect(b.pages).toHaveLength(MAX_PAGES);
  });

  it('sign sets title + immutable', () => {
    const b = sign({ pages: ['hi'] }, 'x'.repeat(100));
    expect(b.title?.length).toBe(MAX_TITLE_LENGTH);
    expect(isEditable(b)).toBe(false);
  });
});
