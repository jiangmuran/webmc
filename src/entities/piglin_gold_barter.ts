export interface BarterItem {
  id: string;
  weight: number;
  countMin: number;
  countMax: number;
}

export const BARTER_TABLE: BarterItem[] = [
  { id: 'enchanted_book', weight: 5, countMin: 1, countMax: 1 },
  { id: 'iron_boots', weight: 8, countMin: 1, countMax: 1 },
  { id: 'potion_fire_resistance', weight: 8, countMin: 1, countMax: 1 },
  { id: 'splash_potion_fire_resistance', weight: 8, countMin: 1, countMax: 1 },
  { id: 'ender_pearl', weight: 10, countMin: 2, countMax: 4 },
  { id: 'string', weight: 20, countMin: 3, countMax: 9 },
  { id: 'quartz', weight: 20, countMin: 5, countMax: 12 },
  { id: 'obsidian', weight: 40, countMin: 1, countMax: 1 },
  { id: 'crying_obsidian', weight: 40, countMin: 1, countMax: 3 },
  { id: 'fire_charge', weight: 40, countMin: 1, countMax: 1 },
  { id: 'leather', weight: 40, countMin: 2, countMax: 4 },
  { id: 'soul_sand', weight: 40, countMin: 2, countMax: 8 },
  { id: 'nether_brick', weight: 40, countMin: 2, countMax: 8 },
  { id: 'spectral_arrow', weight: 40, countMin: 6, countMax: 12 },
  { id: 'gravel', weight: 40, countMin: 8, countMax: 16 },
];

export function totalWeight(): number {
  return BARTER_TABLE.reduce((a, b) => a + b.weight, 0);
}

export function barterReward(rng: () => number): BarterItem | undefined {
  const total = totalWeight();
  let roll = rng() * total;
  for (const i of BARTER_TABLE) {
    roll -= i.weight;
    if (roll <= 0) return i;
  }
  return BARTER_TABLE[BARTER_TABLE.length - 1];
}
