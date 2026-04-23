export interface AnvilSlot {
  name?: string;
  enchantLevels: number;
  repairCost: number;
}

export const MAX_COST = 39;
export const PRIOR_WORK_MULT = 2;

export function renameCost(original: string, newName: string): number {
  return original === newName ? 0 : 1;
}

export function combineCost(a: AnvilSlot, b: AnvilSlot, rename: boolean): number {
  const base = a.enchantLevels + b.enchantLevels;
  const priorWork = a.repairCost * PRIOR_WORK_MULT + b.repairCost * PRIOR_WORK_MULT;
  const total = base + priorWork + (rename ? 1 : 0);
  return total;
}

export function isTooExpensive(cost: number): boolean {
  return cost >= MAX_COST;
}
