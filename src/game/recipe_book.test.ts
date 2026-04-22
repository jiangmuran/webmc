import { describe, it, expect } from 'vitest';
import {
  hydrate,
  makeRecipeBook,
  markSeen,
  serialize,
  toggleFilters,
  unlockRecipe,
} from './recipe_book';

describe('recipe book', () => {
  it('unlock records + highlights', () => {
    const b = makeRecipeBook();
    expect(unlockRecipe(b, 'crafting_table')).toBe(true);
    expect(b.unlocked.has('crafting_table')).toBe(true);
    expect(b.newUnlocks.has('crafting_table')).toBe(true);
  });

  it('duplicate unlock returns false', () => {
    const b = makeRecipeBook();
    unlockRecipe(b, 'r1');
    expect(unlockRecipe(b, 'r1')).toBe(false);
  });

  it('markSeen clears highlight', () => {
    const b = makeRecipeBook();
    unlockRecipe(b, 'r1');
    markSeen(b, 'r1');
    expect(b.newUnlocks.has('r1')).toBe(false);
  });

  it('toggleFilters flips', () => {
    const b = makeRecipeBook();
    expect(b.filtersEnabled).toBe(true);
    toggleFilters(b);
    expect(b.filtersEnabled).toBe(false);
  });

  it('serialize + hydrate round-trip', () => {
    const a = makeRecipeBook();
    unlockRecipe(a, 'r1');
    unlockRecipe(a, 'r2');
    const data = serialize(a);
    const b = makeRecipeBook();
    hydrate(b, data);
    expect(b.unlocked.has('r1')).toBe(true);
  });
});
