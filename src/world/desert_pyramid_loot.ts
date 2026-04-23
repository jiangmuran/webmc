// Desert pyramid: 4 hidden chests under sandstone pressure plate trap
// (9 TNT). Loot pool and trap layout.

export const DESERT_PYRAMID_CHEST_COUNT = 4;
export const TRAP_TNT_COUNT = 9;

export type DesertLoot =
  | 'gunpowder'
  | 'sand'
  | 'bone'
  | 'rotten_flesh'
  | 'string'
  | 'spider_eye'
  | 'enchanted_book'
  | 'gold_ingot'
  | 'emerald'
  | 'iron_ingot'
  | 'diamond'
  | 'horse_armor_iron'
  | 'horse_armor_gold'
  | 'horse_armor_diamond'
  | 'saddle'
  | 'golden_apple'
  | 'enchanted_golden_apple';

export const DESERT_LOOT_POOL: { id: DesertLoot; weight: number }[] = [
  { id: 'diamond', weight: 1 },
  { id: 'enchanted_golden_apple', weight: 1 },
  { id: 'horse_armor_diamond', weight: 2 },
  { id: 'horse_armor_gold', weight: 4 },
  { id: 'horse_armor_iron', weight: 6 },
  { id: 'golden_apple', weight: 4 },
  { id: 'iron_ingot', weight: 15 },
  { id: 'gold_ingot', weight: 10 },
  { id: 'emerald', weight: 8 },
  { id: 'enchanted_book', weight: 5 },
  { id: 'bone', weight: 25 },
  { id: 'rotten_flesh', weight: 25 },
  { id: 'gunpowder', weight: 25 },
  { id: 'spider_eye', weight: 10 },
  { id: 'string', weight: 20 },
  { id: 'sand', weight: 15 },
  { id: 'saddle', weight: 2 },
];

export function rollLoot(rand: () => number): DesertLoot {
  const total = DESERT_LOOT_POOL.reduce((s, e) => s + e.weight, 0);
  let r = rand() * total;
  for (const e of DESERT_LOOT_POOL) {
    if (r < e.weight) return e.id;
    r -= e.weight;
  }
  return 'bone';
}
