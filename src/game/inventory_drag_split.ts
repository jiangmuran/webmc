// Inventory drag splitting. Left-drag distributes a stack evenly across
// hovered slots. Right-drag puts exactly 1 per slot.

export interface Slot {
  id: string | null;
  count: number;
}

export interface DragState {
  mode: 'left' | 'right' | null;
  heldId: string | null;
  heldCount: number;
  hoveredSlotIndices: number[];
}

export function makeDrag(): DragState {
  return { mode: null, heldId: null, heldCount: 0, hoveredSlotIndices: [] };
}

export function startDrag(
  s: DragState,
  mode: 'left' | 'right',
  heldId: string,
  heldCount: number,
): void {
  s.mode = mode;
  s.heldId = heldId;
  s.heldCount = heldCount;
  s.hoveredSlotIndices = [];
}

export function hoverSlot(s: DragState, index: number): void {
  if (s.mode === null) return;
  if (!s.hoveredSlotIndices.includes(index)) s.hoveredSlotIndices.push(index);
}

export interface CommitResult {
  slotUpdates: { index: number; add: number }[];
  heldCountAfter: number;
}

export function commitDrag(s: DragState, stackMax: number, existingSlots: Slot[]): CommitResult {
  if (s.mode === null || s.heldId === null) {
    return { slotUpdates: [], heldCountAfter: s.heldCount };
  }
  const targets = s.hoveredSlotIndices.filter((i) => {
    const slot = existingSlots[i];
    return slot && (slot.id === null || slot.id === s.heldId) && slot.count < stackMax;
  });
  if (targets.length === 0) {
    return { slotUpdates: [], heldCountAfter: s.heldCount };
  }
  if (s.mode === 'right') {
    const updates: CommitResult['slotUpdates'] = [];
    let remaining = s.heldCount;
    for (const i of targets) {
      if (remaining <= 0) break;
      updates.push({ index: i, add: 1 });
      remaining -= 1;
    }
    return { slotUpdates: updates, heldCountAfter: remaining };
  }
  // left: distribute evenly
  const per = Math.floor(s.heldCount / targets.length);
  const updates: CommitResult['slotUpdates'] = targets.map((i) => ({ index: i, add: per }));
  const remaining = s.heldCount - per * targets.length;
  return { slotUpdates: updates, heldCountAfter: remaining };
}
