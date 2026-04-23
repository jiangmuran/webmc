export interface Item {
  id: string;
  maxDurability: number;
  damage: number;
  priorWorkPenalty: number;
  enchants: readonly { id: string; level: number }[];
  customName?: string;
}

export const MAX_USABLE_COST = 40;

export function repairMaterialCost(target: Item, sacrificeCount: number): number {
  const damageBase = Math.max(0, Math.ceil(target.damage / (target.maxDurability / 4)));
  return damageBase * sacrificeCount + 2 * sacrificeCount;
}

export function renameCost(hasNewName: boolean): number {
  return hasNewName ? 1 : 0;
}

export function combineCost(a: Item, b: Item, renamed: boolean): number {
  let cost = a.priorWorkPenalty + b.priorWorkPenalty;
  for (const e of b.enchants) {
    cost += e.level * 2;
  }
  cost += repairMaterialCost(a, 1);
  cost += renameCost(renamed);
  return cost;
}

export function isTooExpensive(cost: number, inCreative: boolean): boolean {
  return !inCreative && cost >= MAX_USABLE_COST;
}

export function nextPriorWorkPenalty(current: number): number {
  return current * 2 + 1;
}
