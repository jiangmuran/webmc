// Loot table system. A table is a collection of pools; each pool rolls N
// entries from its weighted items. Per-roll count is optionally randomised.
// Entries may have conditions (fortune level, silk touch, killer type).

import type { ItemStack } from '@/items/item';

export interface LootCondition {
  fortuneMin?: number;
  requiresKillerType?: string;
  requiresSilkTouch?: boolean;
}

export interface LootEntry {
  itemId: number;
  minCount: number;
  maxCount: number;
  weight: number;
  condition?: LootCondition;
}

export interface LootPool {
  rolls: number;
  bonusRollsPerLuck?: number;
  entries: readonly LootEntry[];
}

export interface LootTable {
  id: string;
  pools: readonly LootPool[];
}

export interface LootContext {
  fortune: number;
  silkTouch: boolean;
  killerType: string | null;
  luck: number;
  rng: () => number;
}

function conditionMatches(entry: LootEntry, ctx: LootContext): boolean {
  const c = entry.condition;
  if (!c) return true;
  if (c.fortuneMin !== undefined && ctx.fortune < c.fortuneMin) return false;
  if (c.requiresSilkTouch && !ctx.silkTouch) return false;
  if (c.requiresKillerType && ctx.killerType !== c.requiresKillerType) return false;
  return true;
}

function weightedPick(entries: readonly LootEntry[], rng: () => number): LootEntry | null {
  if (entries.length === 0) return null;
  const total = entries.reduce((s, e) => s + e.weight, 0);
  let pick = rng() * total;
  for (const e of entries) {
    pick -= e.weight;
    if (pick <= 0) return e;
  }
  return entries[entries.length - 1] ?? null;
}

export function rollLoot(table: LootTable, ctx: LootContext): ItemStack[] {
  const stacks: ItemStack[] = [];
  for (const pool of table.pools) {
    const bonus = pool.bonusRollsPerLuck ? Math.floor(pool.bonusRollsPerLuck * ctx.luck) : 0;
    const rolls = pool.rolls + bonus;
    const candidates = pool.entries.filter((e) => conditionMatches(e, ctx));
    for (let i = 0; i < rolls; i++) {
      const entry = weightedPick(candidates, ctx.rng);
      if (!entry) continue;
      const count = entry.minCount + Math.floor(ctx.rng() * (entry.maxCount - entry.minCount + 1));
      if (count > 0) stacks.push({ itemId: entry.itemId, count, damage: 0 });
    }
  }
  return stacks;
}
