export const MAX_HEIGHT = 3;
export const GROW_CHANCE = 1 / 16;

export interface Column {
  currentHeight: number;
  supportedBy: 'dirt' | 'grass_block' | 'sand' | 'red_sand' | 'other';
  adjacentWater: boolean;
}

export function canPlace(support: Column['supportedBy'], adjacentWater: boolean): boolean {
  if (support === 'other') return false;
  return adjacentWater;
}

export function shouldGrow(c: Column, rng: () => number): boolean {
  if (c.currentHeight >= MAX_HEIGHT) return false;
  return rng() < GROW_CHANCE;
}

export function destroyOnUnsupported(_top: Column, below: Column | undefined): boolean {
  if (below === undefined) return true;
  return !canPlace(below.supportedBy, below.adjacentWater) && below.currentHeight === 0;
}
