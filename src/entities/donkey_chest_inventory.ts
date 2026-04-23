// Donkey + mule get an inventory when a chest item is right-clicked.
// 15 slots; chest is returned on death.

export const DONKEY_INVENTORY_SLOTS = 15;

export interface Donkey {
  hasChest: boolean;
  slots: (string | null)[];
}

export function attachChest(d: Donkey): Donkey {
  if (d.hasChest) return d;
  return {
    hasChest: true,
    slots: Array.from({ length: DONKEY_INVENTORY_SLOTS }, () => null as string | null),
  };
}

export function canCarryChest(entityType: string): boolean {
  return entityType === 'donkey' || entityType === 'mule' || entityType === 'llama';
}

export function onDeath(d: Donkey): string[] {
  const drops: string[] = [];
  if (d.hasChest) drops.push('chest');
  for (const s of d.slots) if (s) drops.push(s);
  return drops;
}

export function emptySlotCount(d: Donkey): number {
  return d.slots.filter((s) => s === null).length;
}
