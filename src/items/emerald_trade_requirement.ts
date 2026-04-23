export interface Requirement {
  emeraldCost: number;
  itemNeeded?: { id: string; count: number };
}

export function canTrade(r: Requirement, emeraldsHave: number, itemsHave: number): boolean {
  if (emeraldsHave < r.emeraldCost) return false;
  if (r.itemNeeded && itemsHave < r.itemNeeded.count) return false;
  return true;
}

export function cheapestTrade(reqs: Requirement[]): Requirement | undefined {
  if (reqs.length === 0) return undefined;
  return [...reqs].sort((a, b) => a.emeraldCost - b.emeraldCost)[0];
}
