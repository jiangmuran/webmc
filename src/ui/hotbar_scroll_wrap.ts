export const HOTBAR_SLOTS = 9;

export function scroll(currentSlot: number, dir: number): number {
  const next = (currentSlot + dir) % HOTBAR_SLOTS;
  return (next + HOTBAR_SLOTS) % HOTBAR_SLOTS;
}

export function byDigitKey(digit: number): number {
  return Math.max(0, Math.min(HOTBAR_SLOTS - 1, digit - 1));
}

export function pickBlock(slot: number, inventory: readonly (string | null)[]): number {
  const idx = inventory.indexOf(inventory[slot] ?? null);
  return idx >= 0 ? idx : slot;
}
