import { describe, it, expect } from 'vitest';
import { makeShelf, insert, take, comparatorOutput, canHold } from './chiseled_bookshelf_query';

describe('chiseled bookshelf', () => {
  it('accepts books only', () => {
    expect(canHold('webmc:book')).toBe(true);
    expect(canHold('webmc:stone')).toBe(false);
  });

  it('insert + take', () => {
    const s = makeShelf();
    expect(insert(s, 0, 'webmc:book')).toBe(true);
    expect(insert(s, 0, 'webmc:book')).toBe(false);
    expect(take(s, 0)).toBe('webmc:book');
    expect(take(s, 0)).toBeNull();
  });

  it('comparator reads last slot', () => {
    const s = makeShelf();
    insert(s, 3, 'webmc:book');
    expect(comparatorOutput(s)).toBe(4);
  });

  it('empty = 0', () => {
    expect(comparatorOutput(makeShelf())).toBe(0);
  });
});
