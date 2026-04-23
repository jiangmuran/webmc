// Count player's emeralds across inventory for pre-trade eligibility.

export interface Slot {
  id: string | null;
  count: number;
}

export function countEmeralds(slots: Slot[]): number {
  let total = 0;
  for (const s of slots) if (s.id === 'emerald') total += s.count;
  return total;
}

export function canAfford(slots: Slot[], cost: number): boolean {
  return countEmeralds(slots) >= cost;
}

export function consumeEmeralds(slots: Slot[], cost: number): boolean {
  if (!canAfford(slots, cost)) return false;
  let remaining = cost;
  for (const s of slots) {
    if (s.id !== 'emerald') continue;
    if (remaining <= 0) break;
    const take = Math.min(s.count, remaining);
    s.count -= take;
    remaining -= take;
    if (s.count === 0) s.id = null;
  }
  return true;
}
