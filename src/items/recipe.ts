import type { ItemId, ItemStack } from './item';
import { stack } from './item';

export type GridCell = ItemStack | null;

export interface ShapedRecipe {
  readonly kind: 'shaped';
  readonly pattern: readonly (readonly (ItemId | null)[])[];
  readonly result: ItemStack;
  readonly mirror?: boolean;
}

export interface ShapelessRecipe {
  readonly kind: 'shapeless';
  readonly ingredients: readonly ItemId[];
  readonly result: ItemStack;
}

export type Recipe = ShapedRecipe | ShapelessRecipe;

export class RecipeRegistry {
  private readonly recipes: Recipe[] = [];

  register(r: Recipe): void {
    this.recipes.push(r);
  }

  all(): readonly Recipe[] {
    return this.recipes;
  }

  resolve(grid: readonly (readonly GridCell[])[]): ItemStack | null {
    for (const r of this.recipes) {
      if (r.kind === 'shaped' && matchesShaped(grid, r)) return r.result;
      if (r.kind === 'shapeless' && matchesShapeless(grid, r)) return r.result;
    }
    return null;
  }
}

interface BoundingBox {
  minR: number;
  maxR: number;
  minC: number;
  maxC: number;
}

function boundingBox(grid: readonly (readonly GridCell[])[]): BoundingBox | null {
  let minR = Infinity;
  let maxR = -Infinity;
  let minC = Infinity;
  let maxC = -Infinity;
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c++) {
      if (row[c]) {
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (c < minC) minC = c;
        if (c > maxC) maxC = c;
      }
    }
  }
  if (minR === Infinity) return null;
  return { minR, maxR, minC, maxC };
}

function patternAt(
  grid: readonly (readonly GridCell[])[],
  bb: BoundingBox,
  mirror: boolean,
): (ItemId | null)[][] {
  const h = bb.maxR - bb.minR + 1;
  const w = bb.maxC - bb.minC + 1;
  const out: (ItemId | null)[][] = [];
  for (let r = 0; r < h; r++) {
    const row: (ItemId | null)[] = [];
    const srcRow = grid[bb.minR + r];
    for (let c = 0; c < w; c++) {
      const col = mirror ? bb.maxC - c : bb.minC + c;
      const cell = srcRow?.[col] ?? null;
      row.push(cell ? cell.itemId : null);
    }
    out.push(row);
  }
  return out;
}

function patternsEqual(
  a: readonly (readonly (ItemId | null)[])[],
  b: readonly (readonly (ItemId | null)[])[],
): boolean {
  if (a.length !== b.length) return false;
  for (let r = 0; r < a.length; r++) {
    const ar = a[r];
    const br = b[r];
    if (!ar || !br) return false;
    if (ar.length !== br.length) return false;
    for (let c = 0; c < ar.length; c++) {
      if (ar[c] !== br[c]) return false;
    }
  }
  return true;
}

function matchesShaped(grid: readonly (readonly GridCell[])[], recipe: ShapedRecipe): boolean {
  const bb = boundingBox(grid);
  if (!bb) return false;
  const extracted = patternAt(grid, bb, false);
  if (patternsEqual(extracted, recipe.pattern)) return true;
  if (recipe.mirror !== false) {
    const mirrored = patternAt(grid, bb, true);
    if (patternsEqual(mirrored, recipe.pattern)) return true;
  }
  return false;
}

function matchesShapeless(
  grid: readonly (readonly GridCell[])[],
  recipe: ShapelessRecipe,
): boolean {
  const got: ItemId[] = [];
  for (const row of grid) {
    for (const cell of row) {
      if (cell) got.push(cell.itemId);
    }
  }
  if (got.length !== recipe.ingredients.length) return false;
  const remaining = [...recipe.ingredients];
  for (const id of got) {
    const i = remaining.indexOf(id);
    if (i < 0) return false;
    remaining.splice(i, 1);
  }
  return remaining.length === 0;
}

export function cellOf(itemId: ItemId, count = 1): GridCell {
  return stack(itemId, count, 0);
}
