// Piglin bartering. A player "hands" a gold ingot to a piglin; after a 6-
// second animation, the piglin throws back a roll from the bartering loot
// table. Weighted — most rolls return obsidian/crying obsidian/iron_nugget,
// rare rolls return enchanted books or netherite scrap.

export interface BarteringDrop {
  item: string;
  count: number;
  weight: number;
}

export const BARTERING_TABLE: readonly BarteringDrop[] = [
  { item: 'webmc:gravel', count: 8, weight: 40 },
  { item: 'webmc:iron_nugget', count: 10, weight: 40 },
  { item: 'webmc:leather', count: 2, weight: 40 },
  { item: 'webmc:nether_brick', count: 4, weight: 40 },
  { item: 'webmc:obsidian', count: 1, weight: 40 },
  { item: 'webmc:crying_obsidian', count: 1, weight: 40 },
  { item: 'webmc:fire_charge', count: 1, weight: 40 },
  { item: 'webmc:soul_sand', count: 4, weight: 20 },
  { item: 'webmc:quartz', count: 10, weight: 20 },
  { item: 'webmc:splash_potion_fire_resistance', count: 1, weight: 10 },
  { item: 'webmc:potion_fire_resistance', count: 1, weight: 10 },
  { item: 'webmc:iron_boots', count: 1, weight: 8 },
  { item: 'webmc:ender_pearl', count: 4, weight: 5 },
  { item: 'webmc:enchanted_book_soul_speed', count: 1, weight: 5 },
];

export function rollBarter(rng: () => number = Math.random): BarteringDrop {
  const total = BARTERING_TABLE.reduce((s, d) => s + d.weight, 0);
  let pick = rng() * total;
  for (const d of BARTERING_TABLE) {
    pick -= d.weight;
    if (pick <= 0) return d;
  }
  const last = BARTERING_TABLE[BARTERING_TABLE.length - 1];
  if (!last) throw new Error('empty bartering table');
  return last;
}
