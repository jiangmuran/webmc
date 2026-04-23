// Sapling growth. Two stages; requires light ≥ 9 and vertical clearance.

export interface SaplingCtx {
  stage: 0 | 1;
  lightLevel: number;
  verticalClearance: number;
}

export const SAPLING_MIN_LIGHT = 9;
export const TREE_CLEARANCE_MIN = 5;

export function randomTick(c: SaplingCtx, rand: () => number): SaplingCtx | 'grow_tree' {
  if (c.lightLevel < SAPLING_MIN_LIGHT) return c;
  if (rand() > 0.125) return c;
  if (c.stage === 0) return { ...c, stage: 1 };
  if (c.verticalClearance < TREE_CLEARANCE_MIN) return c;
  return 'grow_tree';
}

export function canGrowHere(c: SaplingCtx): boolean {
  return c.lightLevel >= SAPLING_MIN_LIGHT && c.verticalClearance >= TREE_CLEARANCE_MIN;
}
