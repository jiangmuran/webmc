// Book & Quill → signed Book. Signed books cannot be edited.
//
// Wiki (minecraft.wiki/w/Book_and_Quill): JE allows "up to 100
// pages, with up to 1023 characters per page, and up to 102,300
// characters inside the entire book." Old constant was 256 (BE's
// per-page limit). Sibling book_and_quill.ts now matches.

export const MAX_PAGES = 100;
export const MAX_CHARS_PER_PAGE = 1023;

export interface BookDraft {
  title: string | null;
  author: string | null;
  pages: string[];
  signed: boolean;
}

export function setPage(b: BookDraft, idx: number, text: string): BookDraft {
  if (b.signed) return b;
  if (idx < 0 || idx >= MAX_PAGES) return b;
  const pages = [...b.pages];
  while (pages.length <= idx) pages.push('');
  pages[idx] = text.slice(0, MAX_CHARS_PER_PAGE);
  return { ...b, pages };
}

export function sign(b: BookDraft, title: string, author: string): BookDraft {
  if (b.signed) return b;
  return { ...b, signed: true, title: title.slice(0, 16), author };
}

export function canEdit(b: BookDraft): boolean {
  return !b.signed;
}

export function copy(b: BookDraft, generation: 0 | 1 | 2): BookDraft | null {
  if (!b.signed) return null;
  if (generation >= 2) return null; // too tattered
  return { ...b };
}
