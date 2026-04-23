export const MAX_PAGES = 100;
export const MAX_CHARS_PER_PAGE = 1024;
export const MAX_TITLE_LENGTH = 32;

export interface Book {
  pages: string[];
  title?: string;
  signed?: boolean;
}

export function addPage(b: Book, text: string): Book {
  if (b.pages.length >= MAX_PAGES) return b;
  return { ...b, pages: [...b.pages, text.slice(0, MAX_CHARS_PER_PAGE)] };
}

export function sign(b: Book, title: string): Book {
  return {
    ...b,
    title: title.slice(0, MAX_TITLE_LENGTH),
    signed: true,
  };
}

export function isEditable(b: Book): boolean {
  return !b.signed;
}
