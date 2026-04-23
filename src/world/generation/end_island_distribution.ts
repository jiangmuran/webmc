export interface IslandCell {
  cx: number;
  cz: number;
  noise: number;
}

export const OUTER_ISLAND_MIN_DISTANCE = 1000;
export const MIN_NOISE_FOR_ISLAND = 0.5;

export function shouldPlaceIsland(c: IslandCell): boolean {
  const dist = Math.hypot(c.cx * 16, c.cz * 16);
  if (dist < OUTER_ISLAND_MIN_DISTANCE) return false;
  return c.noise >= MIN_NOISE_FOR_ISLAND;
}

export function mainIslandPlatformFlat(cx: number, cz: number): boolean {
  return Math.max(Math.abs(cx), Math.abs(cz)) < 4;
}
