export interface ShapelessRecipe {
  id: string;
  ingredients: readonly string[];
  result: { id: string; count: number };
}

function countMap(items: readonly string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const id of items) {
    if (id === 'air' || id === '') continue;
    m.set(id, (m.get(id) ?? 0) + 1);
  }
  return m;
}

export function matches(recipe: ShapelessRecipe, grid: readonly string[]): boolean {
  const needed = countMap(recipe.ingredients);
  const have = countMap(grid);
  if (needed.size !== have.size) return false;
  for (const [k, v] of needed.entries()) {
    if (have.get(k) !== v) return false;
  }
  return true;
}

export function firstMatch(
  recipes: readonly ShapelessRecipe[],
  grid: readonly string[],
): ShapelessRecipe | undefined {
  return recipes.find((r) => matches(r, grid));
}
