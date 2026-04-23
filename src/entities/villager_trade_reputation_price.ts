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

export function herovillageDiscount(base: number, heroLevel: 1 | 2 | 3 | 4 | 5): number {
  const discount = 0.3 + heroLevel * 0.0625;
  return Math.max(1, Math.floor(base * (1 - discount)));
}
