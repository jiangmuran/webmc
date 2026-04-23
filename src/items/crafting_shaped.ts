// Shaped crafting matcher. Recipe has a pattern (rows of strings) and
// a key mapping char→ingredient. Grid input is 3×3.

export interface ShapedRecipe {
  pattern: string[];
  key: Record<string, string>;
  result: { id: string; count: number };
}

export function matches(recipe: ShapedRecipe, grid: (string | null)[][]): boolean {
  const rh = recipe.pattern.length;
  const rw = Math.max(...recipe.pattern.map((r) => r.length));
  const gh = grid.length;
  const gw = grid[0]?.length ?? 0;
  if (rh > gh || rw > gw) return false;
  // Try all placements of pattern within grid.
  for (let oy = 0; oy <= gh - rh; oy++) {
    for (let ox = 0; ox <= gw - rw; ox++) {
      if (matchesAt(recipe, grid, ox, oy, rw, rh, gw, gh)) return true;
    }
  }
  return false;
}

function matchesAt(
  r: ShapedRecipe,
  grid: (string | null)[][],
  ox: number,
  oy: number,
  rw: number,
  rh: number,
  gw: number,
  gh: number,
): boolean {
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      const inBox = x >= ox && x < ox + rw && y >= oy && y < oy + rh;
      const cell = grid[y]?.[x] ?? null;
      if (!inBox) {
        if (cell !== null) return false;
        continue;
      }
      const ch = r.pattern[y - oy]?.[x - ox] ?? ' ';
      const want = ch === ' ' ? null : (r.key[ch] ?? null);
      if (want !== cell) return false;
    }
  }
  return true;
}
