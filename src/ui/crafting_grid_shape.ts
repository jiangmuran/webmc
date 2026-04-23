export type CraftType = 'shaped' | 'shapeless';

export interface Recipe {
  type: CraftType;
  pattern?: string[];
  ingredients?: string[];
  result: string;
}

export function matchesShaped(r: Recipe, grid: string[][]): boolean {
  if (r.type !== 'shaped' || !r.pattern) return false;
  if (grid.length !== r.pattern.length) return false;
  return r.pattern.every((row, i) => {
    const gridRow = grid[i];
    if (gridRow?.length !== row.length) return false;
    for (let j = 0; j < row.length; j++) {
      const c = row.charAt(j);
      if (c === ' ' ? gridRow[j] !== '' : gridRow[j] !== c) return false;
    }
    return true;
  });
}

export function matchesShapeless(r: Recipe, provided: string[]): boolean {
  if (r.type !== 'shapeless' || !r.ingredients) return false;
  if (r.ingredients.length !== provided.length) return false;
  const sorted = [...provided].sort();
  const expected = [...r.ingredients].sort();
  return sorted.every((v, i) => v === expected[i]);
}
