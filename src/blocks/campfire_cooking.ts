// Campfire cooking. 4 food slots; 30 sec cook time; no fuel required.

export const CAMPFIRE_COOK_TICKS = 600;
export const CAMPFIRE_SLOT_COUNT = 4;

export interface CampfireSlot {
  itemId: string | null;
  cookedTicks: number;
}

export function tick(slot: CampfireSlot): CampfireSlot {
  if (!slot.itemId) return slot;
  return { ...slot, cookedTicks: Math.min(CAMPFIRE_COOK_TICKS, slot.cookedTicks + 1) };
}

export function isDone(slot: CampfireSlot): boolean {
  return slot.cookedTicks >= CAMPFIRE_COOK_TICKS && slot.itemId !== null;
}

const FOOD_MAP: Record<string, string> = {
  raw_beef: 'cooked_beef',
  raw_chicken: 'cooked_chicken',
  raw_cod: 'cooked_cod',
  raw_salmon: 'cooked_salmon',
  raw_mutton: 'cooked_mutton',
  raw_porkchop: 'cooked_porkchop',
  raw_rabbit: 'cooked_rabbit',
  potato: 'baked_potato',
  kelp: 'dried_kelp',
};

export function cookedResult(raw: string): string | null {
  return FOOD_MAP[raw] ?? null;
}

export function acceptable(raw: string): boolean {
  return cookedResult(raw) !== null;
}
