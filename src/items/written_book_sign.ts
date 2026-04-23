// Book & Quill → signed Book. Signed books cannot be edited. Maximum
// pages: 100 per book; max 256 chars per page.

export const MAX_PAGES = 100;
export const MAX_CHARS_PER_PAGE = 256;

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
