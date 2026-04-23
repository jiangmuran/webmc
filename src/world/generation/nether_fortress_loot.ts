export interface LootPool {
  items: { id: string; weight: number; min: number; max: number }[];
}

export const FORTRESS_CHEST: LootPool = {
  items: [
    { id: 'diamond_horse_armor', weight: 3, min: 1, max: 1 },
    { id: 'gold_horse_armor', weight: 8, min: 1, max: 1 },
    { id: 'iron_horse_armor', weight: 10, min: 1, max: 1 },
    { id: 'saddle', weight: 10, min: 1, max: 1 },
    { id: 'gold_ingot', weight: 25, min: 1, max: 3 },
    { id: 'nether_wart', weight: 25, min: 3, max: 7 },
    { id: 'flint_and_steel', weight: 5, min: 1, max: 1 },
    { id: 'diamond', weight: 5, min: 1, max: 2 },
    { id: 'obsidian', weight: 10, min: 2, max: 4 },
  ],
};

export function rollLoot(pool: LootPool, rng: () => number): { id: string; count: number } | undefined {
  const total = pool.items.reduce((a, b) => a + b.weight, 0);
  if (total === 0) return undefined;
  let roll = rng() * total;
  for (const i of pool.items) {
    roll -= i.weight;
    if (roll <= 0) {
      const count = i.min + Math.floor(rng() * (i.max - i.min + 1));
      return { id: i.id, count };
    }
  }
  return undefined;
}
