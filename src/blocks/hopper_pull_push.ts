// Hopper item transfer. Pulls from containers above, pushes to the
// container it's pointing at. Runs at 2.5 items/sec (one every 8 ticks).

export interface Item {
  id: string;
  count: number;
}

export interface Container {
  slots: (Item | null)[];
}

export const HOPPER_RATE_TICKS = 8;

export function firstNonEmpty(c: Container): number {
  return c.slots.findIndex((s) => s !== null && s.count > 0);
}

export function firstSlotAccepting(c: Container, id: string, stackMax = 64): number {
  const same = c.slots.findIndex((s) => s !== null && s.id === id && s.count < stackMax);
  if (same >= 0) return same;
  return c.slots.findIndex((s) => s === null);
}

export function moveOne(from: Container, to: Container, stackMax = 64): boolean {
  const fromIdx = firstNonEmpty(from);
  if (fromIdx < 0) return false;
  const fromItem = from.slots[fromIdx];
  if (!fromItem) return false;
  const toIdx = firstSlotAccepting(to, fromItem.id, stackMax);
  if (toIdx < 0) return false;
  const toSlot = to.slots[toIdx];
  if (!toSlot) {
    to.slots[toIdx] = { id: fromItem.id, count: 1 };
  } else {
    toSlot.count += 1;
  }
  fromItem.count -= 1;
  if (fromItem.count <= 0) from.slots[fromIdx] = null;
  return true;
}

// Hopper also picks up item entities above it.
export interface ItemEntity {
  id: string;
  count: number;
}

export function pickupEntity(h: Container, e: ItemEntity, stackMax = 64): boolean {
  const idx = firstSlotAccepting(h, e.id, stackMax);
  if (idx < 0) return false;
  const cur = h.slots[idx];
  const take = Math.min(e.count, cur ? stackMax - cur.count : stackMax);
  if (take <= 0) return false;
  if (cur) cur.count += take;
  else h.slots[idx] = { id: e.id, count: take };
  e.count -= take;
  return true;
}
