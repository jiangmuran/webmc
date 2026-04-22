// Enchantment table cost logic. MC formula: base level 1-30 (3 offers,
// slot index 0-2). Each slot uses 1 lapis. Bookshelf count 0-15 biases
// toward higher-tier offers.

import { applyEnchant, rollEnchantment, type Enchanted, type EnchantmentId } from './enchantment';
import type { ItemDef } from './item';

export interface OfferQuery {
  def: ItemDef; // the item being enchanted
  bookshelfPower: number; // 0-15, derived from nearby bookshelves
  slotIndex: 0 | 1 | 2;
  rng: () => number;
}

export interface Offer {
  xpLevelCost: number; // what's displayed in the level UI
  xpLevelActual: number; // actually charged on confirm (= xpLevelCost)
  lapisCost: number;
  enchant: { id: EnchantmentId; level: number } | null;
}

// slotIndex 0 = cheap, 2 = expensive.
const SLOT_BASE: readonly number[] = [1, 5, 10];
const SLOT_TOP: readonly number[] = [8, 17, 30];

export function offerFor(q: OfferQuery): Offer {
  const bookshelves = Math.min(15, Math.max(0, q.bookshelfPower));
  const base = SLOT_BASE[q.slotIndex] ?? 1;
  const top = SLOT_TOP[q.slotIndex] ?? 30;
  const levelRange = top - base;
  const levelNoise = 1 + bookshelves / 15;
  const level = Math.floor(base + q.rng() * levelRange * levelNoise * (0.7 + q.rng() * 0.3));
  const clampedLevel = Math.min(top, Math.max(1, level));
  const rolled = rollEnchantment(q.def, clampedLevel, q.rng);
  return {
    xpLevelCost: q.slotIndex + 1, // MC charges 1/2/3 levels
    xpLevelActual: clampedLevel,
    lapisCost: q.slotIndex + 1,
    enchant: rolled,
  };
}

// Apply the selected offer to a stack. Deducts XP level + lapis (caller
// does the bookkeeping); returns the enchanted stack.
export function applyOffer(stack: Enchanted, offer: Offer): Enchanted {
  if (!offer.enchant) return stack;
  return applyEnchant(stack, offer.enchant.id, offer.enchant.level);
}
