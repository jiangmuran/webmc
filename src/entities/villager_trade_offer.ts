// Villager trade offer resolution. Offer has input(s), result, uses left,
// max uses, and price modifiers from demand + reputation + hero effect.

export interface TradeOffer {
  inputs: { id: string; count: number }[];
  result: { id: string; count: number };
  usesLeft: number;
  maxUses: number;
  priceMultiplier: number;
  demand: number;
  specialPrice: number;
}

export function finalFirstInputCount(o: TradeOffer, heroLevel: number, reputation: number): number {
  const base = o.inputs[0]?.count ?? 0;
  const demandAdj = Math.max(0, Math.floor(base * (o.priceMultiplier + o.demand * 0.2)));
  const heroAdj = heroLevel > 0 ? -Math.floor(base * 0.3) : 0;
  const repAdj = reputation > 0 ? -Math.floor(base * 0.05 * Math.min(5, reputation / 10)) : 0;
  return Math.max(1, base + o.specialPrice + demandAdj + heroAdj + repAdj);
}

export function availableToTrade(o: TradeOffer): boolean {
  return o.usesLeft > 0;
}

export function consumeUse(o: TradeOffer): TradeOffer {
  if (o.usesLeft <= 0) return o;
  return { ...o, usesLeft: o.usesLeft - 1, demand: Math.min(30, o.demand + 1) };
}

export function restockUses(o: TradeOffer): TradeOffer {
  return { ...o, usesLeft: o.maxUses, demand: Math.max(0, o.demand - 2) };
}
