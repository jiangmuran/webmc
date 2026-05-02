// Campfire cooking. Like a furnace but: (1) no fuel needed (the campfire
// itself is the fuel), (2) max 4 items cooking at once, (3) 30-second
// cook time per item, (4) doesn't require an output slot — finished items
// pop out automatically.

export interface CampfireSlot {
  itemName: string;
  progressSec: number;
}

export interface CampfireState {
  slots: (CampfireSlot | null)[]; // length 4
  lit: boolean;
}

const COOK_TIME_SEC = 30;
const MAX_SLOTS = 4;

export function makeCampfire(): CampfireState {
  return { slots: Array.from({ length: MAX_SLOTS }, () => null), lit: true };
}

export interface CampfireRecipe {
  input: string;
  output: string;
}

// A subset of the smelting table — cooked meats + baked potato.
//
// Wiki / webmc registry: fish use the modern Java IDs `webmc:cod` and
// `webmc:salmon` (no `raw_` prefix; the prefix was retired around
// 1.13). Old recipes named `raw_fish` / `raw_salmon` would never
// match the actual webmc raw fish items the player picks up. Meats
// (raw_beef / raw_porkchop / raw_chicken / raw_mutton / raw_rabbit)
// keep webmc's `raw_` prefix per the registry convention.
export const CAMPFIRE_RECIPES: readonly CampfireRecipe[] = [
  { input: 'webmc:raw_beef', output: 'webmc:cooked_beef' },
  { input: 'webmc:raw_porkchop', output: 'webmc:cooked_porkchop' },
  { input: 'webmc:raw_chicken', output: 'webmc:cooked_chicken' },
  { input: 'webmc:raw_mutton', output: 'webmc:cooked_mutton' },
  { input: 'webmc:raw_rabbit', output: 'webmc:cooked_rabbit' },
  { input: 'webmc:cod', output: 'webmc:cooked_cod' },
  { input: 'webmc:salmon', output: 'webmc:cooked_salmon' },
  { input: 'webmc:potato', output: 'webmc:baked_potato' },
  { input: 'webmc:kelp', output: 'webmc:dried_kelp' },
];

export function findCampfireRecipe(inputName: string): CampfireRecipe | null {
  for (const r of CAMPFIRE_RECIPES) if (r.input === inputName) return r;
  return null;
}

// Try to place a cook-able item. Returns true on success; false if no free
// slot or no matching recipe.
export function placeOnCampfire(state: CampfireState, itemName: string): boolean {
  if (!state.lit) return false;
  if (!findCampfireRecipe(itemName)) return false;
  for (let i = 0; i < state.slots.length; i++) {
    if (state.slots[i] === null) {
      state.slots[i] = { itemName, progressSec: 0 };
      return true;
    }
  }
  return false;
}

export interface CampfireTickResult {
  finishedItems: readonly string[]; // item names to pop out
}

export function tickCampfire(state: CampfireState, dtSec: number): CampfireTickResult {
  if (!state.lit) return { finishedItems: [] };
  const finished: string[] = [];
  for (let i = 0; i < state.slots.length; i++) {
    const slot = state.slots[i];
    if (!slot) continue;
    slot.progressSec += dtSec;
    if (slot.progressSec >= COOK_TIME_SEC) {
      const recipe = findCampfireRecipe(slot.itemName);
      if (recipe) finished.push(recipe.output);
      state.slots[i] = null;
    }
  }
  return { finishedItems: finished };
}
