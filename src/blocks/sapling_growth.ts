// Sapling growth. Two stages; requires light ≥ 9 and vertical clearance.

export interface SaplingCtx {
  stage: 0 | 1;
  lightLevel: number;
  verticalClearance: number;
}

export const SAPLING_MIN_LIGHT = 9;
export const TREE_CLEARANCE_MIN = 5;

// Mutates c.stage in place for the stage-0 → stage-1 transition. Was
// returning `{...c, stage: 1}` per matched call — main.ts feeds this
// from a per-cell scratch in the crop tick (cropTickAccum-gated, but
// still hits potentially dozens of saplings per fire), so the spread
// copy was pure churn. Caller reads result.stage from the returned
// reference (which is `c`) and compares to a saved snapshot of the
// pre-tick stage; mutation preserves that contract.
export function randomTick(c: SaplingCtx, rand: () => number): SaplingCtx | 'grow_tree' {
  if (c.lightLevel < SAPLING_MIN_LIGHT) return c;
  if (rand() > 0.125) return c;
  if (c.stage === 0) {
    c.stage = 1;
    return c;
  }
  if (c.verticalClearance < TREE_CLEARANCE_MIN) return c;
  return 'grow_tree';
}

export function canGrowHere(c: SaplingCtx): boolean {
  return c.lightLevel >= SAPLING_MIN_LIGHT && c.verticalClearance >= TREE_CLEARANCE_MIN;
}
