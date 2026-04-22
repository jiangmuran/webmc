// Moss carpet. Decorative thin block; placed on any full-face top.
// Bonemeal on moss block spreads carpet on top of adjacent blocks.

export function canPlace(blockBelowTopSolid: boolean): boolean {
  return blockBelowTopSolid;
}

export function thicknessBlocks(): number {
  return 1 / 16;
}

// Moss block bonemealed replaces grass-like blocks and covers them
// with moss carpet + scatters azalea/flowers.
export interface SpreadCtx {
  neighborIsDirt: boolean;
  neighborTopIsAir: boolean;
}

export function spreadsTo(c: SpreadCtx): boolean {
  return c.neighborIsDirt && c.neighborTopIsAir;
}

export function breakOnNoSupport(): boolean {
  return true;
}
