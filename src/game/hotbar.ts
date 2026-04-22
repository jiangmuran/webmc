// Player hotbar: 9 slots, selected slot 0..8. Supports scroll-wheel cycle,
// number-key select, middle-click swap with main inventory, and the 1.21
// "hotbar carousel" drag swap.

export const HOTBAR_SLOTS = 9;

export interface HotbarState {
  slots: (string | null)[]; // item ids
  selected: number;
}

export function makeHotbar(): HotbarState {
  return { slots: Array.from({ length: HOTBAR_SLOTS }, () => null), selected: 0 };
}

export function selectedItem(state: HotbarState): string | null {
  return state.slots[state.selected] ?? null;
}

export function selectSlot(state: HotbarState, slot: number): boolean {
  if (slot < 0 || slot >= HOTBAR_SLOTS) return false;
  state.selected = slot;
  return true;
}

// Scroll wheel: positive = forward (to the right), negative = back. Wraps.
export function scrollSelect(state: HotbarState, delta: number): void {
  const d = Math.trunc(delta) % HOTBAR_SLOTS;
  state.selected = (state.selected + d + HOTBAR_SLOTS) % HOTBAR_SLOTS;
}

export function setSlot(state: HotbarState, slot: number, item: string | null): void {
  if (slot < 0 || slot >= HOTBAR_SLOTS) return;
  state.slots[slot] = item;
}

// Swap two slots (e.g. drag from one to another).
export function swap(state: HotbarState, a: number, b: number): boolean {
  if (a < 0 || a >= HOTBAR_SLOTS || b < 0 || b >= HOTBAR_SLOTS) return false;
  const tmp = state.slots[a] ?? null;
  state.slots[a] = state.slots[b] ?? null;
  state.slots[b] = tmp;
  return true;
}
