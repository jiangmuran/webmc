// Wiki (minecraft.wiki/w/Buried_Treasure): canonical Java 1.18+ loot
// table. Old POOL had:
//   - leather_chestplate weight 15 (wiki: 10),
//   - tnt weight 10 (wiki: 5),
//   - emerald weight 20 / count 4-8 (wiki: 5 / 1-4),
//   - missing diamond, prismarine_crystals, leather_helmet,
//     potion_water_breathing entries.
// Sibling buried_treasure.ts already lists the canonical table; this
// module now matches.

export interface TreasureChest {
  items: { id: string; count: number }[];
}

export const GUARANTEED = [{ id: 'heart_of_the_sea', count: 1 }];

export const POOL = [
  { id: 'iron_ingot', weight: 20, min: 1, max: 4 },
  { id: 'gold_ingot', weight: 10, min: 1, max: 4 },
  { id: 'tnt', weight: 5, min: 1, max: 2 },
  { id: 'emerald', weight: 5, min: 1, max: 4 },
  { id: 'diamond', weight: 5, min: 1, max: 2 },
  { id: 'prismarine_crystals', weight: 5, min: 1, max: 5 },
  { id: 'leather_helmet', weight: 10, min: 1, max: 1 },
  { id: 'leather_chestplate', weight: 10, min: 1, max: 1 },
  { id: 'iron_sword', weight: 5, min: 1, max: 1 },
  { id: 'cooked_cod', weight: 10, min: 2, max: 4 },
  { id: 'cooked_salmon', weight: 10, min: 2, max: 4 },
  { id: 'potion_water_breathing', weight: 5, min: 1, max: 1 },
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
