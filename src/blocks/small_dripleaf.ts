// Small dripleaf. Needs clay or moss under water; bonemealed becomes
// big dripleaf. Drops nothing without shears.

export interface SmallDripleafCtx {
  onClayOrMoss: boolean;
  inWater: boolean;
}

export function canPlace(c: SmallDripleafCtx): boolean {
  return c.onClayOrMoss && c.inWater;
}

export function bonemealGrowsBig(rand: () => number): boolean {
  return rand() < 0.75;
}

export function harvestWithShears(): number {
  return 1;
}

export function harvestWithoutShears(): number {
  return 0;
}

export const SMALL_DRIPLEAF_HEIGHT_BLOCKS = 2;
