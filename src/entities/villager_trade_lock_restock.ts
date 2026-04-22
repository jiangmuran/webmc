// Villager trade lock + restock. A trade becomes locked after its
// max uses are consumed per day. Villager works at workstation to
// restock (2x daily, 10 real seconds each).

export interface Trade {
  inputs: { id: string; count: number }[];
  output: { id: string; count: number };
  maxUses: number;
  uses: number;
  priceMultiplier: number;
  experienceReward: number;
}

export interface Villager {
  trades: Trade[];
  lastRestockMs: number;
  restocksToday: number;
  workAtMs: number;
}

export const RESTOCK_COOLDOWN_MS = 10_000;
export const MAX_RESTOCKS_PER_DAY = 2;

export function tradeIsLocked(t: Trade): boolean {
  return t.uses >= t.maxUses;
}

export function anyLocked(v: Villager): boolean {
  return v.trades.some(tradeIsLocked);
}

export interface RestockQuery {
  nowMs: number;
  villagerAtWorkstation: boolean;
}

export function tryRestock(
  v: Villager,
  q: RestockQuery,
): 'ok' | 'no_workstation' | 'cooldown' | 'cap' {
  if (!q.villagerAtWorkstation) return 'no_workstation';
  if (!anyLocked(v)) return 'cooldown';
  if (v.restocksToday >= MAX_RESTOCKS_PER_DAY) return 'cap';
  if (q.nowMs - v.lastRestockMs < RESTOCK_COOLDOWN_MS) return 'cooldown';
  for (const t of v.trades) t.uses = 0;
  v.lastRestockMs = q.nowMs;
  v.restocksToday += 1;
  return 'ok';
}

// New day resets restock count.
export function onNewDay(v: Villager): void {
  v.restocksToday = 0;
}
