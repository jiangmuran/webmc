// Mob loot tables. Each entry has a roll range + condition (e.g. only
// drops if killed by player, or looting ≥ N). Used at death time.

export interface LootEntry {
  itemId: string;
  minCount: number;
  maxCount: number;
  weight: number;
  requiresPlayerKill?: boolean;
  requiresLootingLevel?: number;
}

export interface MobLootTable {
  entries: LootEntry[];
}

export interface RollQuery {
  killedByPlayer: boolean;
  lootingLevel: number;
  rand: () => number;
}

export function rollLoot(table: MobLootTable, q: RollQuery): { itemId: string; count: number }[] {
  const out: { itemId: string; count: number }[] = [];
  for (const e of table.entries) {
    if (e.requiresPlayerKill && !q.killedByPlayer) continue;
    if (e.requiresLootingLevel && q.lootingLevel < e.requiresLootingLevel) continue;
    const extra = q.lootingLevel > 0 ? Math.floor(q.rand() * (q.lootingLevel + 1)) : 0;
    const count = e.minCount + Math.floor(q.rand() * (e.maxCount - e.minCount + 1)) + extra;
    if (count > 0) out.push({ itemId: e.itemId, count });
  }
  return out;
}

// Common mob tables
export const ZOMBIE_LOOT: MobLootTable = {
  entries: [
    { itemId: 'webmc:rotten_flesh', minCount: 0, maxCount: 2, weight: 1 },
    {
      itemId: 'webmc:iron_ingot',
      minCount: 1,
      maxCount: 1,
      weight: 1,
      requiresPlayerKill: true,
      requiresLootingLevel: 1,
    },
  ],
};

export const SKELETON_LOOT: MobLootTable = {
  entries: [
    { itemId: 'webmc:bone', minCount: 0, maxCount: 2, weight: 1 },
    { itemId: 'webmc:arrow', minCount: 0, maxCount: 2, weight: 1 },
  ],
};
