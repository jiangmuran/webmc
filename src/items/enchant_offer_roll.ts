// Enchantment table offer rolling. The table shows 3 offers based on
// bookshelf count (0..15) and a per-offer level 1..30. The "cost" of
// an offer is its level; the "hint" enchantment is the first applied.
// Seed is stable until the player enchants something.

export interface OfferRollQuery {
  bookshelves: number;
  rand: () => number; // 0..1
}

export interface Offer {
  requiredLevel: number;
}

export function rollOffers(q: OfferRollQuery): [Offer, Offer, Offer] {
  const bs = Math.min(15, Math.max(0, q.bookshelves));
  const offers: Offer[] = [];
  for (let slot = 0; slot < 3; slot++) {
    // MC formula (simplified): base = random(1..8) + bookshelves/2 + randint(0..bookshelves/2)
    const base = Math.floor(q.rand() * 8) + 1 + Math.floor(bs / 2);
    const noise = Math.floor(q.rand() * (bs / 2 + 1));
    let lvl = base + noise;
    // slot-specific floors: slot 0 ≥ max(1, lvl/3), slot 1 ≥ (lvl*2)/3 + 1, slot 2 ≥ max(lvl, bs*2)
    if (slot === 0) lvl = Math.max(1, Math.floor(lvl / 3));
    else if (slot === 1) lvl = Math.max(1, Math.floor((lvl * 2) / 3) + 1);
    else lvl = Math.max(lvl, bs * 2);
    offers.push({ requiredLevel: Math.max(1, Math.min(30, lvl)) });
  }
  return offers as [Offer, Offer, Offer];
}

// Lapis cost per slot: slot index + 1.
export function lapisCost(slotIndex: 0 | 1 | 2): number {
  return slotIndex + 1;
}

// XP cost: pays slot+1 levels (not the offer's requiredLevel).
export function xpLevelsSpent(slotIndex: 0 | 1 | 2): number {
  return slotIndex + 1;
}
