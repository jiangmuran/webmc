export interface CrafterSlot {
  locked: boolean;
  hasItem: boolean;
}

export function emptySlotsAllowed(slots: CrafterSlot[]): number {
  return slots.filter((s) => !s.locked).length;
}

export function isSlotDisabled(s: CrafterSlot): boolean {
  return s.locked && !s.hasItem;
}

export function triggersWhenAllFilled(slots: CrafterSlot[]): boolean {
  return slots.every((s) => s.locked || s.hasItem);
}
