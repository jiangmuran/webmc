// Recipe book. Tracks unlocked recipes per player; unlocking happens
// when the player acquires one of the recipe's ingredients, or crafts
// the output once.

export interface RecipeBookState {
  unlocked: Set<string>;
  newUnlocks: Set<string>; // highlighted in UI until seen
  filtersEnabled: boolean;
}

export function makeRecipeBook(): RecipeBookState {
  return { unlocked: new Set(), newUnlocks: new Set(), filtersEnabled: true };
}

export function unlockRecipe(state: RecipeBookState, recipeId: string): boolean {
  if (state.unlocked.has(recipeId)) return false;
  state.unlocked.add(recipeId);
  state.newUnlocks.add(recipeId);
  return true;
}

export function markSeen(state: RecipeBookState, recipeId: string): void {
  state.newUnlocks.delete(recipeId);
}

export function toggleFilters(state: RecipeBookState): void {
  state.filtersEnabled = !state.filtersEnabled;
}

export interface SerializedBook {
  unlocked: string[];
  newUnlocks: string[];
  filtersEnabled: boolean;
}

export function serialize(state: RecipeBookState): SerializedBook {
  return {
    unlocked: Array.from(state.unlocked),
    newUnlocks: Array.from(state.newUnlocks),
    filtersEnabled: state.filtersEnabled,
  };
}

export function hydrate(state: RecipeBookState, data: SerializedBook): void {
  state.unlocked = new Set(data.unlocked);
  state.newUnlocks = new Set(data.newUnlocks);
  state.filtersEnabled = data.filtersEnabled;
}
