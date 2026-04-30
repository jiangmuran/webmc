import { describe, it, expect } from 'vitest';
import {
  addPage,
  copyWrittenBook,
  editPage,
  makeWritableBook,
  MAX_CHARS_PER_PAGE,
  signBook,
} from './book';

describe('book', () => {
  it('adds + edits pages', () => {
    const b = makeWritableBook();
    expect(addPage(b, 'hello')).toBe(true);
    expect(editPage(b, 0, 'world')).toBe(true);
    expect(b.pages[0]).toBe('world');
  });

  it('clips pages at JE 1023 chars (wiki)', () => {
    const b = makeWritableBook();
    addPage(b, 'x'.repeat(MAX_CHARS_PER_PAGE + 100));
    expect(b.pages[0]?.length).toBe(MAX_CHARS_PER_PAGE);
  });

  it('refuses > 100 pages (wiki)', () => {
    const b = makeWritableBook();
    for (let i = 0; i < 100; i++) addPage(b, `page ${i.toString()}`);
    expect(addPage(b, 'overflow')).toBe(false);
  });

  it('signing yields a written book at gen 0', () => {
    const b = makeWritableBook();
    addPage(b, 'intro');
    const signed = signBook(b, 'Guide', 'Alice');
    expect(signed.kind).toBe('written');
    expect(signed.generation).toBe(0);
    expect(signed.pages.length).toBe(1);
  });

  it('copy increments generation up to 3', () => {
    const w = makeWritableBook();
    addPage(w, 'stuff');
    const orig = signBook(w, 't', 'a');
    const copy1 = copyWrittenBook(orig);
    if (!copy1) throw new Error('copy1');
    const copy2 = copyWrittenBook(copy1);
    if (!copy2) throw new Error('copy2');
    const copy3 = copyWrittenBook(copy2);
    expect(copy3).toBeNull(); // gen 3 copy refuses
  });

  it('signing clips title at 32 chars', () => {
    const w = makeWritableBook();
    const signed = signBook(w, 'a'.repeat(100), 'a');
    expect(signed.title.length).toBe(32);
  });
});
