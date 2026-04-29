// Writable book + written book. Writable is player-editable up to 100
// pages × 256 chars. Signing turns it into a written book with title +
// author, no further edits.
// Wiki (minecraft.wiki/w/Book_and_Quill): max 100 pages (raised from
// 50 in 1.14). Old constant was 50, half the modern wiki limit.

const MAX_PAGES = 100;
const MAX_CHARS_PER_PAGE = 256;
const MAX_TITLE_CHARS = 32;

export interface WritableBook {
  kind: 'writable';
  pages: string[];
}

export interface WrittenBook {
  kind: 'written';
  title: string;
  author: string;
  generation: 0 | 1 | 2 | 3; // 0 original, 1 copy, 2 copy of copy, 3 tattered
  pages: readonly string[];
}

export type BookState = WritableBook | WrittenBook;

export function makeWritableBook(): WritableBook {
  return { kind: 'writable', pages: [] };
}

export function addPage(book: WritableBook, text: string): boolean {
  if (book.pages.length >= MAX_PAGES) return false;
  book.pages.push(text.slice(0, MAX_CHARS_PER_PAGE));
  return true;
}

export function editPage(book: WritableBook, index: number, text: string): boolean {
  if (index < 0 || index >= book.pages.length) return false;
  book.pages[index] = text.slice(0, MAX_CHARS_PER_PAGE);
  return true;
}

export function signBook(book: WritableBook, title: string, author: string): WrittenBook {
  return {
    kind: 'written',
    title: title.slice(0, MAX_TITLE_CHARS),
    author,
    generation: 0,
    pages: [...book.pages],
  };
}

// Copying a written book via a crafting table: title/author preserved,
// generation incremented. gen 2 ("copy of copy") refuses further copies —
// MC's 3 generations = original(0), copy(1), copy-of-copy(2).
export function copyWrittenBook(book: WrittenBook): WrittenBook | null {
  if (book.generation >= 2) return null;
  return {
    kind: 'written',
    title: book.title,
    author: book.author,
    generation: (book.generation + 1) as WrittenBook['generation'],
    pages: book.pages,
  };
}
