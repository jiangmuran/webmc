export const MAX_PICKLES = 4;

export function increment(current: number): number {
  return Math.min(MAX_PICKLES, current + 1);
}

export function lightLevel(count: number, waterlogged: boolean): number {
  if (!waterlogged) return 0;
  if (count <= 0) return 0;
  return 3 + (count - 1) * 3;
}

export function bonemealGrowsIfOnCoral(count: number, onCoralBlock: boolean): number {
  return onCoralBlock ? MAX_PICKLES : count;
}
