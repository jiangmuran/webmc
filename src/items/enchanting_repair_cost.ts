// Anvil repair cost. Each time an item is modified by an anvil, the
// "prior work penalty" doubles: 1 → 3 → 7 → 15 → 31 → 63 → ...
// MC caps single anvil ops at 39 XP before showing "Too Expensive!".

export interface RepairCostInput {
  priorWorkLeft: number; // repair count of left input item
  priorWorkRight: number;
  levelsFromEnchants: number; // base XP cost from enchants
  renaming: boolean; // +1 XP
}

export const TOO_EXPENSIVE_THRESHOLD = 40;

export function priorWorkPenalty(priorWork: number): number {
  // MC: penalty = 2^priorWork - 1
  return Math.pow(2, Math.max(0, priorWork)) - 1;
}

export function totalAnvilCost(q: RepairCostInput): number {
  const left = priorWorkPenalty(q.priorWorkLeft);
  const right = priorWorkPenalty(q.priorWorkRight);
  const renameCost = q.renaming ? 1 : 0;
  return q.levelsFromEnchants + left + right + renameCost;
}

export function isTooExpensive(totalCost: number): boolean {
  return totalCost >= TOO_EXPENSIVE_THRESHOLD;
}

// After a successful combine, the new item's priorWork doubles + 1.
export function nextPriorWork(prevMaxPriorWork: number): number {
  return prevMaxPriorWork + 1;
}

// Grindstone removes all enchants AND resets priorWork to 0 (dirt
// cheapens the item back to base repair cost).
export function grindstoneOutput(
  priorWork: number,
  enchants: string[],
): {
  priorWork: number;
  enchants: readonly string[];
  xpDropped: number;
} {
  void priorWork;
  return {
    priorWork: 0,
    enchants: [],
    xpDropped: enchants.length, // simplified
  };
}
