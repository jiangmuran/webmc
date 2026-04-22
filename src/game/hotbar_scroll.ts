// Hotbar scroll wheel + number keys. Mouse wheel cycles slot; number
// keys 1-9 directly select. Shift+scroll scrolls a chest inventory
// instead, left alone here.

export interface HotbarState {
  selected: number; // 0..8
}

export function makeHotbar(): HotbarState {
  return { selected: 0 };
}

export function scroll(s: HotbarState, dy: number): void {
  const step = dy > 0 ? 1 : dy < 0 ? -1 : 0;
  if (step === 0) return;
  s.selected = (s.selected + step + 9) % 9;
}

export function selectSlot(s: HotbarState, n: number): boolean {
  if (n < 0 || n > 8) return false;
  s.selected = n;
  return true;
}

// Pick-block (middle-click): puts target block item into selected hotbar
// slot if not already present elsewhere in hotbar.
export interface PickQuery {
  targetItemId: string;
  hotbar: (string | null)[];
}

export interface PickResult {
  newSelectedIndex: number;
  movedFrom: number | null;
  createdInCreative: boolean;
}

export function pickBlock(s: HotbarState, q: PickQuery, creative: boolean): PickResult {
  const existing = q.hotbar.findIndex((id) => id === q.targetItemId);
  if (existing >= 0) {
    s.selected = existing;
    return { newSelectedIndex: existing, movedFrom: null, createdInCreative: false };
  }
  if (creative) {
    q.hotbar[s.selected] = q.targetItemId;
    return { newSelectedIndex: s.selected, movedFrom: null, createdInCreative: true };
  }
  return { newSelectedIndex: s.selected, movedFrom: null, createdInCreative: false };
}
