// Inventory left-drag distributes a held stack evenly across visited slots;
// right-drag places 1 per slot.

export interface Slot {
  id: string | null;
  count: number;
  maxStack: number;
}

export function splitEvenlyAcrossSlots(
  heldCount: number,
  heldId: string,
  heldMax: number,
  visited: Slot[],
): { perSlot: number; remainder: number } {
  const candidates = visited.filter(
    (s) => s.id === null || (s.id === heldId && s.count < s.maxStack),
  );
  if (candidates.length === 0) return { perSlot: 0, remainder: heldCount };
  const per = Math.floor(heldCount / candidates.length);
  void heldMax;
  const consumed = per * candidates.length;
  return { perSlot: per, remainder: heldCount - consumed };
}

export function placeOnePerSlot(heldCount: number, visited: Slot[]): number {
  const placed = Math.min(heldCount, visited.length);
  return placed;
}
