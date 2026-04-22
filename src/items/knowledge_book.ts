// Knowledge book. Obtainable only via /give — unlocks a set of recipes
// for the player when right-clicked. After use, the book is consumed.
// Each book encodes a list of recipe IDs.

export interface KnowledgeBook {
  recipeIds: readonly string[];
}

export interface UnlockQuery {
  book: KnowledgeBook;
  alreadyUnlocked: Set<string>;
}

export interface UnlockResult {
  newlyUnlocked: readonly string[];
  bookConsumed: boolean;
}

export function useKnowledgeBook(q: UnlockQuery): UnlockResult {
  const newly: string[] = [];
  for (const id of q.book.recipeIds) {
    if (!q.alreadyUnlocked.has(id)) {
      q.alreadyUnlocked.add(id);
      newly.push(id);
    }
  }
  return { newlyUnlocked: newly, bookConsumed: true };
}

// Compose a knowledge book from a list of recipe IDs (dedup + sort).
export function makeKnowledgeBook(recipeIds: readonly string[]): KnowledgeBook {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of recipeIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  out.sort();
  return { recipeIds: out };
}

// Knowledge books from survival: villagers drop one on cure, containing
// their currently-known trade recipe ids. (Not part of standard drops;
// datapack-specific.)
export function makeCureKnowledgeBook(tradeRecipes: readonly string[]): KnowledgeBook {
  return makeKnowledgeBook(tradeRecipes);
}
