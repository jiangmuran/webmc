// Piglin bartering. A player "hands" a gold ingot to a piglin; after a 6-
// second animation (120 ticks) the piglin throws back a roll from the
// bartering loot table.
//
// Wiki (minecraft.wiki/w/Bartering#Items_bartered): canonical Java
// table sums to weight 469. Old table summed to 363 and was missing
// dried_ghast, water_bottle, string, spectral_arrow, blackstone; had
// wrong weights for soul_sand (20→40), ender_pearl (5→10),
// splash/potion_fire_resistance (10→8); and used fixed counts where
// the wiki has count ranges. Sibling src/entities/piglin_barter.ts
// already had the right table.

export interface BarteringDrop {
  item: string;
  minCount: number;
  maxCount: number;
  weight: number;
}

export const BARTERING_TABLE: readonly BarteringDrop[] = [
  { item: 'webmc:enchanted_book_soul_speed', minCount: 1, maxCount: 1, weight: 5 },
  { item: 'webmc:iron_boots_soul_speed', minCount: 1, maxCount: 1, weight: 8 },
  { item: 'webmc:splash_potion_fire_resistance', minCount: 1, maxCount: 1, weight: 8 },
  { item: 'webmc:potion_fire_resistance', minCount: 1, maxCount: 1, weight: 8 },
  { item: 'webmc:water_bottle', minCount: 1, maxCount: 1, weight: 10 },
  { item: 'webmc:dried_ghast', minCount: 1, maxCount: 1, weight: 10 },
  { item: 'webmc:iron_nugget', minCount: 10, maxCount: 36, weight: 10 },
  { item: 'webmc:ender_pearl', minCount: 2, maxCount: 4, weight: 10 },
  { item: 'webmc:string', minCount: 3, maxCount: 9, weight: 20 },
  { item: 'webmc:quartz', minCount: 5, maxCount: 12, weight: 20 },
  { item: 'webmc:obsidian', minCount: 1, maxCount: 1, weight: 40 },
  { item: 'webmc:crying_obsidian', minCount: 1, maxCount: 3, weight: 40 },
  { item: 'webmc:fire_charge', minCount: 1, maxCount: 1, weight: 40 },
  { item: 'webmc:leather', minCount: 2, maxCount: 4, weight: 40 },
  { item: 'webmc:soul_sand', minCount: 2, maxCount: 8, weight: 40 },
  { item: 'webmc:nether_brick', minCount: 2, maxCount: 8, weight: 40 },
  { item: 'webmc:spectral_arrow', minCount: 6, maxCount: 12, weight: 40 },
  { item: 'webmc:gravel', minCount: 8, maxCount: 16, weight: 40 },
  { item: 'webmc:blackstone', minCount: 8, maxCount: 16, weight: 40 },
];

export const BARTERING_TOTAL_WEIGHT = 469;

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

export function rollCount(d: BarteringDrop, rng: () => number = Math.random): number {
  if (d.maxCount === d.minCount) return d.minCount;
  return d.minCount + Math.floor(rng() * (d.maxCount - d.minCount + 1));
}
