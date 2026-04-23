export const MIN_HEIGHT = 4;
export const MAX_HEIGHT = 6;

export interface Tree {
  trunkHeight: number;
  foliageRadius: number;
  foliageHeight: number;
}

export function rollTree(rng: () => number): Tree {
  const trunk = MIN_HEIGHT + Math.floor(rng() * (MAX_HEIGHT - MIN_HEIGHT + 1));
  return { trunkHeight: trunk, foliageRadius: 2, foliageHeight: 3 };
}

export function leafAt(dx: number, dy: number, dz: number, t: Tree): boolean {
  const distFromCenter = Math.hypot(dx, dz);
  if (dy < t.trunkHeight - t.foliageHeight) return false;
  if (dy > t.trunkHeight) return distFromCenter <= 1;
  return distFromCenter <= t.foliageRadius;
}
