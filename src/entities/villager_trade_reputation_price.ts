export interface TradeSlot {
  basePrice: number;
  demandBonus: number;
}

export const DISCOUNT_PER_REPUTATION = -0.05;

export function priceForReputation(base: number, reputation: number): number {
  const discount = Math.max(-1, Math.min(0.5, reputation * DISCOUNT_PER_REPUTATION));
  const price = base * (1 + discount);
  return Math.max(1, Math.floor(price));
}

export function demandAdjust(base: number, demandEventCount: number): number {
  return base + Math.floor(demandEventCount * 0.2 * base);
}

// Wiki (minecraft.wiki/w/Hero_of_the_Village): "Level I Hero of the
// Village decreases the cost of the first item in a villager trade
// by 30% of the initial price, each additional level decreases the
// price by an another 1/16 (6.25%) for a total price discount of
// 55% at level V. The discount is rounded down but always at least 1."
//
// Wiki example: "Level III would give a 42.5% discount. For trade
// with 14 emeralds as the cost, the discount would be 5 emeralds
// (rounded down from 5.95 emeralds), for a final price of 9 emeralds."
//
// So the DISCOUNT (not the final price) is floored:
//   final = base − floor(base × discountPct)
//
// Old formula was wrong on TWO counts:
// 1. Off-by-one level scaling: `0.30 + level × 0.0625` gave Level I
//    a 36.25% discount vs canon 30%, and Level V a 61.25% discount
//    vs canon 55%, breaking the wiki's stated 55%-at-V cap.
// 2. Rounded the FINAL PRICE instead of the DISCOUNT, which can
//    differ by 1 emerald via floor — wiki's own 14-emerald example
//    yielded 9 emeralds (14 − floor(5.95)), but `floor(14 × 0.575)`
//    yields 8.
//
// Levels:
//   I:    30%
//   II:   36.25%
//   III:  42.5%
//   IV:   48.75%
//   V:    55%
export function herovillageDiscount(base: number, heroLevel: 1 | 2 | 3 | 4 | 5): number {
  const discountPct = 0.3 + (heroLevel - 1) * 0.0625;
  const discount = Math.floor(base * discountPct);
  return Math.max(1, base - discount);
}
