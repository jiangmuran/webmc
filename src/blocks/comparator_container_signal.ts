export interface ContainerSlot {
  count: number;
  maxStack: number;
}

export function comparatorSignalForContainer(slots: readonly ContainerSlot[]): number {
  if (slots.length === 0) return 0;
  let total = 0;
  let anyFilled = 0;
  for (const s of slots) {
    if (s.count > 0) {
      total += s.count / s.maxStack;
      anyFilled++;
    }
  }
  if (anyFilled === 0) return 0;
  const avg = total / slots.length;
  return Math.min(15, Math.floor(1 + avg * 14));
}
