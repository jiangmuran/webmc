export interface TreasureChest {
  items: { id: string; count: number }[];
}

export const GUARANTEED = [{ id: 'heart_of_the_sea', count: 1 }];

export const POOL = [
  { id: 'iron_ingot', weight: 20, min: 1, max: 4 },
  { id: 'gold_ingot', weight: 10, min: 1, max: 4 },
  { id: 'cooked_cod', weight: 10, min: 2, max: 4 },
  { id: 'cooked_salmon', weight: 10, min: 2, max: 4 },
  { id: 'leather_chestplate', weight: 15, min: 1, max: 1 },
  { id: 'iron_sword', weight: 5, min: 1, max: 1 },
  { id: 'tnt', weight: 10, min: 1, max: 2 },
  { id: 'emerald', weight: 20, min: 4, max: 8 },
];

export function rollLoot(rng: () => number, draws: number): TreasureChest {
  const items = [...GUARANTEED];
  const total = POOL.reduce((a, b) => a + b.weight, 0);
  for (let i = 0; i < draws; i++) {
    let roll = rng() * total;
    for (const e of POOL) {
      roll -= e.weight;
      if (roll <= 0) {
        const count = e.min + Math.floor(rng() * (e.max - e.min + 1));
        items.push({ id: e.id, count });
        break;
      }
    }
  }
  return { items };
}
