export interface Quad {
  x: number;
  y: number;
  w: number;
  h: number;
  block: string;
}

export function mergeHorizontally(row: Quad[]): Quad[] {
  if (row.length === 0) return row;
  const sorted = [...row].sort((a, b) => a.x - b.x);
  const out: Quad[] = [];
  for (const q of sorted) {
    const last = out[out.length - 1];
    if (last?.block === q.block && last.y === q.y && last.x + last.w === q.x && last.h === q.h) {
      last.w += q.w;
    } else {
      out.push({ ...q });
    }
  }
  return out;
}
