export function endIslandDensity(x: number, z: number): number {
  const outer = Math.hypot(x, z);
  const base = 100 - outer;
  if (base < 0) return base;
  return Math.min(80, base + 40 * Math.sin(outer * 0.1));
}

export function isEndIsland(x: number, z: number, rng: () => number): boolean {
  const d = Math.hypot(x, z);
  if (d <= 64) return false;
  if (d >= 1024 * 1024) return false;
  return rng() < 0.1;
}

export const CENTRAL_ISLAND_RADIUS = 100;

export function insideCentralIsland(x: number, z: number): boolean {
  return Math.hypot(x, z) <= CENTRAL_ISLAND_RADIUS;
}
