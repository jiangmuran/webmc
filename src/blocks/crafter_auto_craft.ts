// Crafter block (1.21 Tricky Trials). 3×3 container that auto-crafts
// on redstone pulse, ejecting the result out its facing side. Disabled
// slots are skipped when matching recipes; comparator output reads how
// many slots contain items.

export interface CrafterSlot {
  item: string | null;
  count: number;
  disabled: boolean;
}

export interface CrafterState {
  slots: CrafterSlot[]; // length 9
  facing: 'up' | 'down' | 'north' | 'south' | 'east' | 'west';
  triggered: boolean;
}

export function makeCrafter(): CrafterState {
  return {
    slots: Array.from({ length: 9 }, () => ({ item: null, count: 0, disabled: false })),
    facing: 'up',
    triggered: false,
  };
}

export interface Recipe {
  readonly pattern: readonly (string | null)[]; // 9 slots
  readonly output: { item: string; count: number };
}

export interface CrafterTickCtx {
  redstoneEdge: boolean; // rising edge this tick
  recipes: readonly Recipe[];
}

export interface CrafterTickResult {
  crafted: { item: string; count: number } | null;
  ejectFacing: CrafterState['facing'];
}

// Returns matched recipe if the non-disabled slot items match its pattern
// exactly (ignoring disabled slots).
function matchRecipe(state: CrafterState, recipes: readonly Recipe[]): Recipe | null {
  for (const r of recipes) {
    let ok = true;
    for (let i = 0; i < 9; i++) {
      const slot = state.slots[i];
      const patt = r.pattern[i];
      if (!slot) {
        ok = false;
        break;
      }
      if (slot.disabled) {
        if (patt !== null) {
          ok = false;
          break;
        }
        continue;
      }
      if (patt !== slot.item) {
        ok = false;
        break;
      }
      if (patt !== null && slot.count <= 0) {
        ok = false;
        break;
      }
    }
    if (ok) return r;
  }
  return null;
}

export function tickCrafter(state: CrafterState, ctx: CrafterTickCtx): CrafterTickResult {
  if (!ctx.redstoneEdge) return { crafted: null, ejectFacing: state.facing };
  const recipe = matchRecipe(state, ctx.recipes);
  if (!recipe) return { crafted: null, ejectFacing: state.facing };
  // Consume 1 of each non-disabled, populated slot.
  for (let i = 0; i < 9; i++) {
    const slot = state.slots[i];
    if (!slot || slot.disabled || slot.item === null) continue;
    slot.count--;
    if (slot.count <= 0) {
      slot.item = null;
      slot.count = 0;
    }
  }
  return { crafted: recipe.output, ejectFacing: state.facing };
}

export function comparatorSignal(state: CrafterState): number {
  let filledOrDisabled = 0;
  for (const s of state.slots) {
    if (s.disabled) filledOrDisabled++;
    else if (s.item !== null && s.count > 0) filledOrDisabled++;
  }
  return filledOrDisabled;
}

export function toggleDisabledSlot(state: CrafterState, slotIndex: number): boolean {
  const s = state.slots[slotIndex];
  if (!s) return false;
  s.disabled = !s.disabled;
  return true;
}
