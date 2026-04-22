// Loot table weighted rolls. Each pool has entries with weights;
// sum weight → uniform roll → entry. Rolls repeated N times per pool.

export interface LootEntry {
  id: string;
  weight: number;
  minCount: number;
  maxCount: number;
}

export interface LootPool {
  rolls: number;
  entries: LootEntry[];
}

export interface RollResult {
  id: string;
  count: number;
}

export function rollPool(pool: LootPool, rand: () => number): RollResult[] {
  const out: RollResult[] = [];
  const total = pool.entries.reduce((s, e) => s + e.weight, 0);
  for (let i = 0; i < pool.rolls; i++) {
    let pick = rand() * total;
    for (const e of pool.entries) {
      if (pick < e.weight) {
        const count = e.minCount + Math.floor(rand() * (e.maxCount - e.minCount + 1));
        out.push({ id: e.id, count });
        break;
      }
      pick -= e.weight;
    }
  }
  return out;
}

export function totalWeight(pool: LootPool): number {
  return pool.entries.reduce((s, e) => s + e.weight, 0);
}
