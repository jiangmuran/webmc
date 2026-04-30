export const MAX_PICKLES = 4;

export function increment(current: number): number {
  return Math.min(MAX_PICKLES, current + 1);
}

// Wiki (minecraft.wiki/w/Sea_Pickle): waterlogged pickles emit light
// 6/9/12/15 for counts 1..4. Old formula `3 + (count-1)*3` returned
// 3/6/9/12 — off by 3 across the board (matches the dry-pickle case
// the wiki explicitly contrasts against).
export function lightLevel(count: number, waterlogged: boolean): number {
  if (!waterlogged) return 0;
  if (count <= 0) return 0;
  return 3 + count * 3;
}

export function bonemealGrowsIfOnCoral(count: number, onCoralBlock: boolean): number {
  return onCoralBlock ? MAX_PICKLES : count;
}
