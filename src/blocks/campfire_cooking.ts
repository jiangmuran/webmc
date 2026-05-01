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

// Wiki (minecraft.wiki/w/Campfire): "Cookable items: beef, chicken,
// cod, mutton, porkchop, rabbit, salmon, potato, kelp." Java
// canonical IDs use NO `raw_` prefix; cod/salmon never had one even
// in legacy. Old map listed `raw_cod`/`raw_salmon` (never valid IDs)
// and missed every modern Java canonical name (`beef`, `chicken`,
// etc.) — placing modern raw meat on a campfire silently failed
// `acceptable` and never cooked. Both spellings now resolve.
const FOOD_MAP: Record<string, string> = {
  beef: 'cooked_beef',
  raw_beef: 'cooked_beef',
  chicken: 'cooked_chicken',
  raw_chicken: 'cooked_chicken',
  porkchop: 'cooked_porkchop',
  raw_porkchop: 'cooked_porkchop',
  mutton: 'cooked_mutton',
  raw_mutton: 'cooked_mutton',
  rabbit: 'cooked_rabbit',
  raw_rabbit: 'cooked_rabbit',
  cod: 'cooked_cod',
  salmon: 'cooked_salmon',
  potato: 'baked_potato',
  kelp: 'dried_kelp',
};

export function cookedResult(raw: string): string | null {
  return FOOD_MAP[raw] ?? null;
}

export function acceptable(raw: string): boolean {
  return cookedResult(raw) !== null;
}
