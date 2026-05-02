// Written book. Signing a book-and-quill produces a read-only "written
// book" with a fixed title + author. Copies made in a crafting grid
// increment generation: original → copy_of_original → copy_of_copy,
// then copying stops (generation 2 is the cap).

export type BookGeneration = 0 | 1 | 2; // 0 = original signed, 1 = copy, 2 = copy of copy

export interface WrittenBook {
  title: string;
  author: string;
  pages: readonly string[];
  generation: BookGeneration;
}

// Wiki (minecraft.wiki/w/Book_and_Quill): JE allows "up to 100
// pages, with up to 1023 characters per page, and up to 102,300
// characters inside the entire book." Old constant was 1024 — off
// by 1 from the canonical Java Edition limit. Sibling
// book_and_quill.ts and written_book_sign.ts now match.
export const MAX_PAGES = 100;
export const MAX_CHARS_PER_PAGE = 1023;
export const MAX_TITLE_CHARS = 32;

export interface SignBookQuery {
  pages: readonly string[];
  title: string;
  author: string;
}

export function signBook(q: SignBookQuery): WrittenBook | null {
  if (q.title.length > MAX_TITLE_CHARS) return null;
  if (q.pages.length > MAX_PAGES) return null;
  for (const p of q.pages) if (p.length > MAX_CHARS_PER_PAGE) return null;
  return { title: q.title, author: q.author, pages: [...q.pages], generation: 0 };
}

export function copyBook(book: WrittenBook): WrittenBook | null {
  if (book.generation >= 2) return null;
  const nextGen = (book.generation + 1) as BookGeneration;
  return { ...book, generation: nextGen };
}

// Reading: returns the page content at `pageIndex`, or null if out of
// range.
export function readPage(book: WrittenBook, pageIndex: number): string | null {
  if (pageIndex < 0 || pageIndex >= book.pages.length) return null;
  return book.pages[pageIndex] ?? null;
}

export function bookTitleForUI(book: WrittenBook): string {
  if (book.generation === 1) return `Copy of ${book.title}`;
  if (book.generation === 2) return `Copy of Copy of ${book.title}`;
  return book.title;
}
