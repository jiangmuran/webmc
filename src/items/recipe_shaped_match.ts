export interface ShapedRecipe {
  id: string;
  pattern: readonly string[];
  key: Record<string, string>;
  result: { id: string; count: number };
}

function trimmedPattern(p: readonly string[]): readonly string[] {
  let top = 0;
  while (top < p.length && (p[top] ?? '').trim() === '') top++;
  let bottom = p.length;
  while (bottom > top && (p[bottom - 1] ?? '').trim() === '') bottom--;
  const rows = p.slice(top, bottom);
  if (rows.length === 0) return rows;
  let left = Math.min(...rows.map((r) => r.length - r.trimStart().length));
  let right = Math.min(...rows.map((r) => r.length - r.trimEnd().length));
  if (!Number.isFinite(left)) left = 0;
  if (!Number.isFinite(right)) right = 0;
  return rows.map((r) => r.slice(left, r.length - right));
}

export function matches(recipe: ShapedRecipe, grid: readonly (readonly string[])[]): boolean {
  const pattern = trimmedPattern(recipe.pattern);
  if (pattern.length === 0) return false;
  const h = pattern.length;
  const w = pattern[0]?.length ?? 0;
  if (w === 0) return false;
  if (grid.length < h || (grid[0]?.length ?? 0) < w) return false;
  for (let oy = 0; oy <= grid.length - h; oy++) {
    for (let ox = 0; ox <= (grid[0]?.length ?? 0) - w; ox++) {
      if (attemptAt(recipe, pattern, grid, ox, oy)) return true;
    }
  }
  return false;
}

function attemptAt(
  recipe: ShapedRecipe,
  pattern: readonly string[],
  grid: readonly (readonly string[])[],
  ox: number,
  oy: number,
): boolean {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < (grid[0]?.length ?? 0); x++) {
      const dy = y - oy;
      const dx = x - ox;
      const gridItem = grid[y]?.[x] ?? '';
      if (dy < 0 || dx < 0 || dy >= pattern.length || dx >= (pattern[0]?.length ?? 0)) {
        if (gridItem !== '' && gridItem !== 'air') return false;
      } else {
        const ch = pattern[dy]?.charAt(dx) ?? ' ';
        const expected = ch === ' ' ? '' : (recipe.key[ch] ?? '');
        if (expected === '' && gridItem !== '' && gridItem !== 'air') return false;
        if (expected !== '' && gridItem !== expected) return false;
      }
    }
  }
  return true;
}
