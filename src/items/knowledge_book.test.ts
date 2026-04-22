import { describe, it, expect } from 'vitest';
import { makeCureKnowledgeBook, makeKnowledgeBook, useKnowledgeBook } from './knowledge_book';

describe('knowledge book', () => {
  it('unlock adds new recipes', () => {
    const book = makeKnowledgeBook(['webmc:cake', 'webmc:diamond_sword']);
    const unlocked = new Set<string>();
    const r = useKnowledgeBook({ book, alreadyUnlocked: unlocked });
    expect(r.newlyUnlocked.length).toBe(2);
    expect(r.bookConsumed).toBe(true);
  });

  it('already-unlocked recipes skipped', () => {
    const book = makeKnowledgeBook(['webmc:cake']);
    const unlocked = new Set<string>(['webmc:cake']);
    const r = useKnowledgeBook({ book, alreadyUnlocked: unlocked });
    expect(r.newlyUnlocked.length).toBe(0);
  });

  it('makeKnowledgeBook dedups and sorts', () => {
    const b = makeKnowledgeBook(['webmc:b', 'webmc:a', 'webmc:b']);
    expect(b.recipeIds).toEqual(['webmc:a', 'webmc:b']);
  });

  it('cure book wraps trade recipes', () => {
    expect(makeCureKnowledgeBook(['webmc:trade_1', 'webmc:trade_2']).recipeIds.length).toBe(2);
  });
});
