export interface CornerNeighbors {
  side1Solid: boolean;
  side2Solid: boolean;
  cornerSolid: boolean;
}

export function aoVertex(n: CornerNeighbors): number {
  if (n.side1Solid && n.side2Solid) return 0;
  const count = (n.side1Solid ? 1 : 0) + (n.side2Solid ? 1 : 0) + (n.cornerSolid ? 1 : 0);
  return [3, 2, 1, 0][count] ?? 0;
}

export function aoToBrightness(level: number): number {
  return 0.5 + level / 6;
}
