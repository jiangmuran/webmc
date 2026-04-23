// Hopper pulls from container above: scans left-to-right, top-to-bottom
// (matching MC slot order). First-nonempty wins.

export interface InventorySlot {
  id: string | null;
  count: number;
}

export function firstPullable(container: InventorySlot[]): number {
  for (let i = 0; i < container.length; i++) {
    const s = container[i];
    if (s && s.id !== null && s.count > 0) return i;
  }
  return -1;
}

export function pullOne(container: InventorySlot[]): { id: string; fromSlot: number } | null {
  const idx = firstPullable(container);
  if (idx < 0) return null;
  const s = container[idx];
  const id = s?.id;
  if (!s || !id) return null;
  s.count -= 1;
  if (s.count === 0) s.id = null;
  return { id, fromSlot: idx };
}

export const HOPPER_TICK_INTERVAL = 8; // pulls once every 8 ticks
