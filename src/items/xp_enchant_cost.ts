export interface EnchantTableOffer {
  slot: 0 | 1 | 2;
  levelRequirement: number;
}

export interface OfferContext {
  bookshelvesNearby: number;
  rngSeed: number;
}

export const MAX_BOOKSHELVES = 15;

export function offersFor(ctx: OfferContext): readonly EnchantTableOffer[] {
  const shelves = Math.min(MAX_BOOKSHELVES, Math.max(0, ctx.bookshelvesNearby));
  const base = Math.floor(shelves * 2);
  return [
    { slot: 0, levelRequirement: Math.max(1, Math.floor(base / 3) + 1) },
    { slot: 1, levelRequirement: Math.max(1, Math.floor((base * 2) / 3) + 1) },
    { slot: 2, levelRequirement: Math.max(1, base) },
  ];
}

export function lapisCostForSlot(slot: 0 | 1 | 2): number {
  return slot + 1;
}

export function xpLevelsConsumed(slot: 0 | 1 | 2): number {
  return slot + 1;
}
