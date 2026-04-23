// Curing a zombie villager near another villager applies a permanent
// trading discount for the curing player.

export const DISCOUNT_MAJOR_POSITIVE = 20;
export const DISCOUNT_RANGE_BLOCKS = 16;

export interface CureBonusCtx {
  witnessesNearby: number;
  alreadyDiscountedOnce: boolean;
}

export function discountApplied(c: CureBonusCtx): boolean {
  return c.witnessesNearby > 0;
}

export function discountMultiplier(timesCured: number): number {
  // Each cure stacks up to 5×, diminishing returns.
  return Math.max(0.25, 1 - Math.min(timesCured, 5) * 0.15);
}

export const CURE_PLAYER_RANGE_BLOCKS = 32;
