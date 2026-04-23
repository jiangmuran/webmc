export interface Trade {
  buy: string;
  buyCount: number;
  sell: string;
  sellCount: number;
  uses: number;
  maxUses: number;
}

export const COMMON_TRADES: Trade[] = [
  { buy: 'emerald', buyCount: 1, sell: 'acacia_sapling', sellCount: 1, uses: 0, maxUses: 12 },
  { buy: 'emerald', buyCount: 1, sell: 'pumpkin', sellCount: 1, uses: 0, maxUses: 12 },
  { buy: 'emerald', buyCount: 2, sell: 'sea_pickle', sellCount: 1, uses: 0, maxUses: 12 },
  { buy: 'emerald', buyCount: 1, sell: 'wheat_seeds', sellCount: 1, uses: 0, maxUses: 12 },
];

export const RARE_TRADES: Trade[] = [
  { buy: 'emerald', buyCount: 5, sell: 'blue_ice', sellCount: 1, uses: 0, maxUses: 3 },
  { buy: 'emerald', buyCount: 10, sell: 'podzol', sellCount: 3, uses: 0, maxUses: 3 },
];

export function canTrade(t: Trade): boolean {
  return t.uses < t.maxUses;
}

export function afterTrade(t: Trade): Trade {
  return canTrade(t) ? { ...t, uses: t.uses + 1 } : t;
}
