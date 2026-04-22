// Comparator signal from container fill. MC formula:
//   signal = 1 + (totalItems / totalCapacity) * 14, rounded,
// where totalItems and totalCapacity sum across all slots, and each
// item's "fraction" is count / maxStackSize (so half a stack of
// ender pearls counts more than half a stack of dirt).

export interface ComparatorSlot {
  item: string;
  count: number;
  maxStack: number;
}

export interface ComparatorContainer {
  slots: readonly ComparatorSlot[];
  slotCount: number;
}

export function comparatorFillSignal(container: ComparatorContainer): number {
  if (container.slotCount === 0) return 0;
  let frac = 0;
  let hasItems = false;
  for (const s of container.slots) {
    if (s.count > 0) {
      hasItems = true;
      frac += s.count / s.maxStack;
    }
  }
  if (!hasItems) return 0;
  const normalized = frac / container.slotCount;
  return Math.floor(1 + normalized * 14);
}

// Subtract mode: front signal - max(side signal A, side signal B).
export interface ComparatorInput {
  front: number; // 0..15
  sideLeft: number;
  sideRight: number;
}

export function subtractModeOutput(q: ComparatorInput): number {
  const side = Math.max(q.sideLeft, q.sideRight);
  return Math.max(0, q.front - side);
}

// Compare mode: pass front signal iff it's ≥ max(sides); else 0.
export function compareModeOutput(q: ComparatorInput): number {
  const side = Math.max(q.sideLeft, q.sideRight);
  return q.front >= side ? q.front : 0;
}
