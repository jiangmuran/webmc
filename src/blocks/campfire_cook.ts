// Campfire cooking. Holds up to 4 food items; each cooks for 30s
// (600 ticks) in parallel, then pops out. Hopper below pulls cooked
// output but not raw inputs.

export interface CampfireSlot {
  rawId: string | null;
  startTick: number;
}

export interface Campfire {
  slots: [CampfireSlot, CampfireSlot, CampfireSlot, CampfireSlot];
  lit: boolean;
}

export const COOK_TICKS = 600;
export const MAX_SLOTS = 4;

export function makeCampfire(lit = true): Campfire {
  return {
    slots: [
      { rawId: null, startTick: 0 },
      { rawId: null, startTick: 0 },
      { rawId: null, startTick: 0 },
      { rawId: null, startTick: 0 },
    ],
    lit,
  };
}

const COOKABLE: Record<string, string> = {
  'webmc:beef': 'webmc:cooked_beef',
  'webmc:porkchop': 'webmc:cooked_porkchop',
  'webmc:chicken': 'webmc:cooked_chicken',
  'webmc:cod': 'webmc:cooked_cod',
  'webmc:salmon': 'webmc:cooked_salmon',
  'webmc:mutton': 'webmc:cooked_mutton',
  'webmc:rabbit': 'webmc:cooked_rabbit',
  'webmc:potato': 'webmc:baked_potato',
  'webmc:kelp': 'webmc:dried_kelp',
};

export function isCookable(id: string): boolean {
  return id in COOKABLE;
}

export function addItem(c: Campfire, id: string, nowTick: number): boolean {
  if (!c.lit) return false;
  if (!isCookable(id)) return false;
  const slot = c.slots.find((s) => s.rawId === null);
  if (!slot) return false;
  slot.rawId = id;
  slot.startTick = nowTick;
  return true;
}

export interface CookResult {
  dropped: string[];
}

export function tickCampfire(c: Campfire, nowTick: number): CookResult {
  const dropped: string[] = [];
  if (!c.lit) return { dropped };
  for (const slot of c.slots) {
    if (slot.rawId === null) continue;
    if (nowTick - slot.startTick >= COOK_TICKS) {
      dropped.push(COOKABLE[slot.rawId] ?? slot.rawId);
      slot.rawId = null;
    }
  }
  return { dropped };
}

export function extinguish(c: Campfire): void {
  c.lit = false;
}
