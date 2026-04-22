// Book-and-Quill (writable book). Players author pages, paginate at
// ~255 chars. Signing converts to a written book (see written_book.ts).

export const MAX_PAGES = 100;
export const MAX_CHARS_PER_PAGE = 1024;

export interface WritableBook {
  pages: string[];
}

export function makeWritableBook(): WritableBook {
  return { pages: [] };
}

export interface PageEdit {
  pageIndex: number;
  text: string;
}

export interface EditResult {
  accepted: boolean;
  truncated: boolean;
}

export function editPage(book: WritableBook, edit: PageEdit): EditResult {
  if (edit.pageIndex < 0 || edit.pageIndex > book.pages.length) {
    return { accepted: false, truncated: false };
  }
  const truncated = edit.text.length > MAX_CHARS_PER_PAGE;
  const finalText = truncated ? edit.text.slice(0, MAX_CHARS_PER_PAGE) : edit.text;
  if (edit.pageIndex === book.pages.length) {
    if (book.pages.length >= MAX_PAGES) return { accepted: false, truncated: false };
    book.pages.push(finalText);
  } else {
    book.pages[edit.pageIndex] = finalText;
  }
  return { accepted: true, truncated };
}

export function addPage(book: WritableBook): boolean {
  if (book.pages.length >= MAX_PAGES) return false;
  book.pages.push('');
  return true;
}

export function removePage(book: WritableBook, index: number): boolean {
  if (index < 0 || index >= book.pages.length) return false;
  book.pages.splice(index, 1);
  return true;
}

export function swapPages(book: WritableBook, a: number, b: number): boolean {
  if (a < 0 || a >= book.pages.length) return false;
  if (b < 0 || b >= book.pages.length) return false;
  const temp = book.pages[a] ?? '';
  book.pages[a] = book.pages[b] ?? '';
  book.pages[b] = temp;
  return true;
}

// Quill-ink constraint: each edit consumes 1 ink point per 5 characters.
// Writable book has infinite ink in vanilla, but we model a quota for
// possible survival rule variants.
export function inkUnitsForEdit(text: string): number {
  return Math.ceil(text.length / 5);
}
