export type PieceKind = 'corridor' | 'intersection' | 'stairs' | 'room';

export interface Piece {
  kind: PieceKind;
  branchChance: number;
}

export function pickKind(rng: () => number): PieceKind {
  const r = rng();
  if (r < 0.6) return 'corridor';
  if (r < 0.85) return 'intersection';
  if (r < 0.95) return 'stairs';
  return 'room';
}

export const MAX_DEPTH = 8;

export function shouldBranch(depth: number, rng: () => number): boolean {
  if (depth >= MAX_DEPTH) return false;
  return rng() < 0.4;
}

export function railSegmentChance(): number {
  return 0.5;
}

export function cobwebDensity(): number {
  return 0.6;
}
