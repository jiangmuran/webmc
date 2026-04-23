// Shapeless recipe matcher. Ingredients can appear anywhere in the
// grid; counts must match exactly.

export interface ShapelessRecipe {
  ingredients: string[];
  result: { id: string; count: number };
}

export function matches(recipe: ShapelessRecipe, gridItems: (string | null)[]): boolean {
  const items = gridItems.filter((x): x is string => x !== null);
  if (items.length !== recipe.ingredients.length) return false;
  const need = [...recipe.ingredients].sort();
  const have = [...items].sort();
  for (let i = 0; i < need.length; i++) if (need[i] !== have[i]) return false;
  return true;
}
