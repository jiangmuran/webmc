// Piglin bartering: give a gold ingot, receive a random item from
// a weighted loot table. Triggers ~cooldown before next barter.
//
// Wiki (minecraft.wiki/w/Bartering): canonical loot weights. Total
// weight in JE is 469 — the old table summed to 459 (missing the
// dried_ghast entry, weight 10) and listed iron_nugget min count 9
// instead of 10.

export interface BarterEntry {
  item: string;
  weight: number;
  minCount: number;
  maxCount: number;
}

export const PIGLIN_BARTER_TABLE: BarterEntry[] = [
  { item: 'enchanted_book_soul_speed', weight: 5, minCount: 1, maxCount: 1 },
  { item: 'iron_boots_soul_speed', weight: 8, minCount: 1, maxCount: 1 },
  { item: 'splash_fire_resistance', weight: 8, minCount: 1, maxCount: 1 },
  { item: 'potion_fire_resistance', weight: 8, minCount: 1, maxCount: 1 },
  { item: 'water_bottle', weight: 10, minCount: 1, maxCount: 1 },
  { item: 'dried_ghast', weight: 10, minCount: 1, maxCount: 1 },
  { item: 'iron_nugget', weight: 10, minCount: 10, maxCount: 36 },
  { item: 'ender_pearl', weight: 10, minCount: 2, maxCount: 4 },
  { item: 'string', weight: 20, minCount: 3, maxCount: 9 },
  { item: 'quartz', weight: 20, minCount: 5, maxCount: 12 },
  { item: 'obsidian', weight: 40, minCount: 1, maxCount: 1 },
  { item: 'crying_obsidian', weight: 40, minCount: 1, maxCount: 3 },
  { item: 'fire_charge', weight: 40, minCount: 1, maxCount: 1 },
  { item: 'leather', weight: 40, minCount: 2, maxCount: 4 },
  { item: 'soul_sand', weight: 40, minCount: 2, maxCount: 8 },
  { item: 'nether_brick', weight: 40, minCount: 2, maxCount: 8 },
  { item: 'spectral_arrow', weight: 40, minCount: 6, maxCount: 12 },
  { item: 'gravel', weight: 40, minCount: 8, maxCount: 16 },
  { item: 'blackstone', weight: 40, minCount: 8, maxCount: 16 },
];

export function totalWeight(): number {
  return PIGLIN_BARTER_TABLE.reduce((s, e) => s + e.weight, 0);
}

export function rollBarter(rand: () => number): BarterEntry {
  const total = totalWeight();
  let roll = rand() * total;
  for (const e of PIGLIN_BARTER_TABLE) {
    if (roll < e.weight) return e;
    roll -= e.weight;
  }
  const last = PIGLIN_BARTER_TABLE[PIGLIN_BARTER_TABLE.length - 1];
  if (!last) throw new Error('empty barter table');
  return last;
}

// Wiki: "After the piglin takes the gold ingot and examines it for
// 6 seconds (120 gameticks) it tosses a random item to the player."
// Old 40-tick (2 s) cooldown was 3× too short.
export const PIGLIN_BARTER_COOLDOWN_TICKS = 120;
