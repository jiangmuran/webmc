export type GridCell = string | null;

export interface Grid3x3 {
  rows: [GridCell[], GridCell[], GridCell[]];
}

export function boundingBox(g: Grid3x3): { minR: number; maxR: number; minC: number; maxC: number } | undefined {
  let minR = 3;
  let maxR = -1;
  let minC = 3;
  let maxC = -1;
  for (let r = 0; r < 3; r++) {
    const row = g.rows[r];
    for (let c = 0; c < 3; c++) {
      if (row && row[c]) {
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (c < minC) minC = c;
        if (c > maxC) maxC = c;
      }
    }
  }
  if (maxR === -1) return undefined;
  return { minR, maxR, minC, maxC };
}

export function isEmpty(g: Grid3x3): boolean {
  return g.rows.every((row) => row.every((c) => c === null));
}
