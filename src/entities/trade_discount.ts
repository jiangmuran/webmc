// Villager trade discount. Hero of the Village grants a tiered global
// discount (up to -30%). Recent damage or attack reputation raises
// prices. Cured-zombie villagers give a large one-time discount.

export interface TradeContext {
  heroOfVillageLevel: number; // 0..5
  heroBonusTrade: boolean; // true for the first trade after hero status
  curedByThisPlayer: boolean;
  gossipScore: number; // -700..700
}

export const MIN_PRICE = 1;

// Base price → adjusted price for first item cost.
export function adjustedPrice(base: number, ctx: TradeContext): number {
  let price = base;

  // Hero of the Village: 30% + 6.25% per extra level
  if (ctx.heroOfVillageLevel > 0) {
    const disc = 0.3 + (ctx.heroOfVillageLevel - 1) * 0.0625;
    price -= base * disc;
  }

  // Cured zombie: heavy discount (up to -20 per trade + gossip)
  if (ctx.curedByThisPlayer) {
    price -= base * 0.5;
  }

  // Gossip score affects price: each +100 gossip = 1 price unit off
  price -= ctx.gossipScore / 100;

  return Math.max(MIN_PRICE, Math.round(price));
}

// Trade lock: a trade with a maxUses of N locks after N trades per day.
// Restock happens twice per MC day (2x 10 minutes = 12000 ticks each).
export interface TradeInstance {
  maxUses: number;
  usesToday: number;
  lockedTick: number | null;
}

export const RESTOCK_INTERVAL_TICKS = 12000;

export function canTrade(t: TradeInstance): boolean {
  return t.usesToday < t.maxUses;
}

export function recordTrade(t: TradeInstance, nowTick: number): void {
  t.usesToday += 1;
  if (t.usesToday >= t.maxUses) t.lockedTick = nowTick;
}

export function restockIfDue(t: TradeInstance, nowTick: number): boolean {
  if (t.lockedTick === null) return false;
  if (nowTick - t.lockedTick >= RESTOCK_INTERVAL_TICKS) {
    t.usesToday = 0;
    t.lockedTick = null;
    return true;
  }
  return false;
}
