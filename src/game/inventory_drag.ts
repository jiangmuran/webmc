// Inventory drag-distribution logic. Holding primary and dragging across
// slots splits the carried stack evenly among the dragged-over slots;
// secondary click places 1 per slot. Middle click in creative fills each
// dragged slot with a full stack.

export type DragMode = 'split_even' | 'single_per_slot' | 'fill_creative';

export interface DragState {
  mode: DragMode;
  carried: { item: string; count: number; damage: number } | null;
  draggedSlots: number[];
}

export function makeDragState(): DragState {
  return { mode: 'split_even', carried: null, draggedSlots: [] };
}

export function startDrag(
  state: DragState,
  mode: DragMode,
  carried: { item: string; count: number; damage: number },
): void {
  state.mode = mode;
  state.carried = carried;
  state.draggedSlots = [];
}

export function addSlot(state: DragState, slot: number): boolean {
  if (state.draggedSlots.includes(slot)) return false;
  state.draggedSlots.push(slot);
  return true;
}

export interface SlotAllocation {
  slot: number;
  count: number;
}

export interface FinalizeResult {
  allocations: readonly SlotAllocation[];
  carriedRemaining: number;
}

export function finalizeDrag(state: DragState, maxStack: number): FinalizeResult {
  if (!state.carried || state.draggedSlots.length === 0) {
    return { allocations: [], carriedRemaining: state.carried?.count ?? 0 };
  }
  const slots = state.draggedSlots;
  const cap = Math.min(maxStack, state.carried.count);
  const allocations: SlotAllocation[] = [];
  switch (state.mode) {
    case 'split_even': {
      const per = Math.floor(state.carried.count / slots.length);
      if (per === 0) {
        return { allocations: [], carriedRemaining: state.carried.count };
      }
      for (const s of slots) {
        const take = Math.min(per, maxStack);
        allocations.push({ slot: s, count: take });
      }
      break;
    }
    case 'single_per_slot': {
      for (const s of slots) {
        allocations.push({ slot: s, count: 1 });
      }
      break;
    }
    case 'fill_creative': {
      for (const s of slots) {
        allocations.push({ slot: s, count: maxStack });
      }
      void cap;
      break;
    }
  }
  const totalDistributed = allocations.reduce((sum, a) => sum + a.count, 0);
  const remaining =
    state.mode === 'fill_creative'
      ? state.carried.count // creative doesn't deplete
      : Math.max(0, state.carried.count - totalDistributed);
  return { allocations, carriedRemaining: remaining };
}
