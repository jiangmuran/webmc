// 3x3 recipe resolution. Shape-matched + shapeless.

export interface ShapedRecipe {
  kind: 'shaped';
  id: string;
  pattern: string[]; // 1..3 rows of 1..3 chars
  key: Record<string, string>; // char → item id (empty = ' ')
  output: { id: string; count: number };
}

export interface ShapelessRecipe {
  kind: 'shapeless';
  id: string;
  ingredients: string[]; // item ids
  output: { id: string; count: number };
}

export type Recipe = ShapedRecipe | ShapelessRecipe;

export interface GridQuery {
  grid: (string | null)[]; // 9 slots, row-major
  recipes: Recipe[];
}

function normalize(grid: (string | null)[]): (string | null)[][] {
  const rows = [0, 1, 2].map((r) => grid.slice(r * 3, r * 3 + 3));
  // Trim fully-empty rows/cols to get minimal bounding box.
  while (rows.length > 0 && rows[0]?.every((c) => c === null)) rows.shift();
  while (rows.length > 0 && rows[rows.length - 1]?.every((c) => c === null)) rows.pop();
  while (rows[0] && rows.every((r) => r[0] === null)) rows.forEach((r) => r.shift());
  while (rows[0] && rows.every((r) => r[r.length - 1] === null)) rows.forEach((r) => r.pop());
  return rows;
}

export function resolveRecipe(q: GridQuery): Recipe | null {
  const trimmed = normalize(q.grid);
  const present = q.grid.filter((c): c is string => c !== null);
  for (const r of q.recipes) {
    if (r.kind === 'shaped') {
      if (trimmed.length !== r.pattern.length) continue;
      if (trimmed[0] && trimmed[0].length !== r.pattern[0]?.length) continue;
      let ok = true;
      for (let y = 0; y < r.pattern.length && ok; y++) {
        const row = r.pattern[y] ?? '';
        for (let x = 0; x < row.length && ok; x++) {
          const ch = row[x];
          const expected = ch === ' ' || ch === undefined ? null : (r.key[ch] ?? null);
          const cell = trimmed[y]?.[x] ?? null;
          if (cell !== expected) ok = false;
        }
      }
      if (ok) return r;
    } else {
      const sortedPresent = [...present].sort();
      const sortedIng = [...r.ingredients].sort();
      if (sortedPresent.length !== sortedIng.length) continue;
      if (sortedPresent.every((v, i) => v === sortedIng[i])) return r;
    }
  }
  return null;
}
