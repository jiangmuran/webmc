// Middle-click pick block. Picks up the targeted block into hotbar;
// swaps with current slot unless already present.

export interface Hotbar {
  slots: (string | null)[]; // 9 slots
  activeSlot: number;
}

export function pickBlock(h: Hotbar, targetId: string, creative: boolean): Hotbar {
  const existing = h.slots.indexOf(targetId);
  if (existing >= 0) return { ...h, activeSlot: existing };
  if (!creative) return h; // survival: needs inventory copy
  const slots = [...h.slots];
  slots[h.activeSlot] = targetId;
  return { ...h, slots };
}

export function activeItem(h: Hotbar): string | null {
  return h.slots[h.activeSlot] ?? null;
}

export function scrollSlot(h: Hotbar, delta: number): Hotbar {
  const n = (((h.activeSlot + delta) % 9) + 9) % 9;
  return { ...h, activeSlot: n };
}
