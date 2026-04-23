// Anvil XP cost model. Combining items accrues "prior work" penalty
// (2^n - 1). Repeats become exponentially expensive; caps at 39 = "too
// expensive".

export interface AnvilCombine {
  baseCost: number;
  priorWorkLeft: number; // 2^n - 1 for left item
  priorWorkRight: number;
  enchantCost: number;
  renameCost: number;
}

export const TOO_EXPENSIVE = 40;

export function totalXpCost(c: AnvilCombine): number {
  return c.baseCost + c.priorWorkLeft + c.priorWorkRight + c.enchantCost + c.renameCost;
}

export function isTooExpensive(c: AnvilCombine, creative: boolean): boolean {
  if (creative) return false;
  return totalXpCost(c) >= TOO_EXPENSIVE;
}

export function newPriorWorkPenalty(left: number, right: number): number {
  return Math.max(left, right) + 1;
}

export function penaltyFromTimes(times: number): number {
  return Math.pow(2, times) - 1;
}
