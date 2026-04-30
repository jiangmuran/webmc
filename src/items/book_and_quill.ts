// Book-and-Quill (writable book). Players author pages and sign to
// convert to a written book (see written_book.ts).
//
// Wiki (minecraft.wiki/w/Book_and_Quill): "the player can write a
// single book up to 100 pages, with up to 1023 characters per page,
// and up to 102,300 characters inside the entire book." Old constant
// was 1024 — off by 1 from the canonical Java Edition limit.
// Bedrock Edition uses 256 chars/page; this code targets JE.

export const MAX_PAGES = 100;
export const MAX_CHARS_PER_PAGE = 1023;

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
