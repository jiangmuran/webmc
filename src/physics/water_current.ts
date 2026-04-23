export interface WaterCell {
  level: number;
  downflow: boolean;
}

export const PUSH_STRENGTH = 0.014;

export function currentVector(cells: WaterCell[]): { dx: number; dz: number } {
  if (cells.length !== 4) return { dx: 0, dz: 0 };
  const [n, s, e, w] = cells;
  if (!n || !s || !e || !w) return { dx: 0, dz: 0 };
  const dx = (w.level - e.level) * PUSH_STRENGTH;
  const dz = (n.level - s.level) * PUSH_STRENGTH;
  return { dx, dz };
}
