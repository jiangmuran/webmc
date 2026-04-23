// Enchanting table offer roll. Slot 1: 1-8 cost, slot 2: 2-15, slot 3: 3-30.
// Bookshelves boost max level; experience cost equals slot position.

export interface OfferCtx {
  slot: 0 | 1 | 2;
  bookshelves: number; // 0..15
  rand: () => number;
}

export function rollLevel(c: OfferCtx): number {
  const base = 1 + Math.floor(c.rand() * 8) + Math.floor(c.rand() * (c.bookshelves + 1));
  const minForSlot = c.slot === 0 ? 1 : c.slot === 1 ? 2 : 3;
  const maxForSlot = c.slot === 0 ? 30 / 3 : c.slot === 1 ? (30 * 2) / 3 : 30;
  const capped = Math.max(minForSlot, Math.min(maxForSlot, base));
  return Math.floor(capped);
}

export function xpLevelsRequired(slot: 0 | 1 | 2): number {
  return slot + 1;
}

export function lapisCost(slot: 0 | 1 | 2): number {
  return slot + 1;
}

export function canAfford(levelsHeld: number, lapis: number, slot: 0 | 1 | 2): boolean {
  return levelsHeld >= xpLevelsRequired(slot) && lapis >= lapisCost(slot);
}
