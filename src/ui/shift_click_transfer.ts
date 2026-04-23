// Shift-click transfer: moves item from source slot to target container
// (inventory → hotbar, or GUI → inventory).

export interface TransferSlot {
  id: string | null;
  count: number;
  maxStack: number;
}

export function merge(
  from: TransferSlot,
  dest: TransferSlot[],
): { fromRemaining: number; movedCount: number } {
  if (from.id === null || from.count === 0) return { fromRemaining: from.count, movedCount: 0 };
  let remaining = from.count;
  let moved = 0;
  // Merge into matching stacks first.
  for (const d of dest) {
    if (remaining === 0) break;
    if (d.id === from.id && d.count < d.maxStack) {
      const space = d.maxStack - d.count;
      const take = Math.min(space, remaining);
      d.count += take;
      remaining -= take;
      moved += take;
    }
  }
  // Then fill empty slots.
  for (const d of dest) {
    if (remaining === 0) break;
    if (d.id === null) {
      d.id = from.id;
      const take = Math.min(from.maxStack, remaining);
      d.count = take;
      d.maxStack = from.maxStack;
      remaining -= take;
      moved += take;
    }
  }
  return { fromRemaining: remaining, movedCount: moved };
}
