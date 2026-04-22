// Crafter tile-entity (1.21 content). 3×3 inventory + recipe-result slot.
// On a redstone edge, it consumes a configured recipe and spits the result
// out the front. Disabled slots are skipped in the crafting match.

import type { ItemStack } from '@/items/item';

export interface CrafterState {
  slots: (ItemStack | null)[]; // length 9
  disabled: boolean[]; // length 9
  // Output slot tracks the most-recent craft result so hoppers can pick it up.
  output: ItemStack | null;
}

export function makeCrafter(): CrafterState {
  return {
    slots: Array.from({ length: 9 }, () => null),
    disabled: Array.from({ length: 9 }, () => false),
    output: null,
  };
}

export interface CrafterQuery {
  matchRecipe: (grid: readonly (readonly (ItemStack | null)[])[]) => ItemStack | null;
}

// Pulse: tries to craft using non-disabled slots, consumes 1 from each used
// slot, puts the result into state.output. Returns true if a craft succeeded.
export function pulseCrafter(state: CrafterState, query: CrafterQuery): boolean {
  // Only fire if output slot is empty or can merge.
  if (state.output) return false;
  // Build 3x3 grid with disabled slots masked as null.
  const grid: (ItemStack | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  for (let i = 0; i < 9; i++) {
    if (state.disabled[i]) continue;
    const row = grid[Math.floor(i / 3)];
    if (row) row[i % 3] = state.slots[i] ?? null;
  }
  const result = query.matchRecipe(grid);
  if (!result) return false;
  // Consume 1 from each used (non-disabled, non-null) slot.
  for (let i = 0; i < 9; i++) {
    if (state.disabled[i]) continue;
    const s = state.slots[i];
    if (!s) continue;
    state.slots[i] = s.count > 1 ? { ...s, count: s.count - 1 } : null;
  }
  state.output = result;
  return true;
}

// Take the output stack, clearing it.
export function takeOutput(state: CrafterState): ItemStack | null {
  const out = state.output;
  state.output = null;
  return out;
}

export function toggleDisabled(state: CrafterState, slot: number): void {
  if (slot < 0 || slot >= 9) return;
  state.disabled[slot] = !state.disabled[slot];
}
