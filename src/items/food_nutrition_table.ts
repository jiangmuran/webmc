export interface Food {
  hunger: number;
  saturation: number;
  alwaysEdible?: boolean;
  eatTicks?: number;
}

const TABLE: Record<string, Food> = {
  apple: { hunger: 4, saturation: 2.4 },
  bread: { hunger: 5, saturation: 6 },
  carrot: { hunger: 3, saturation: 3.6 },
  cooked_beef: { hunger: 8, saturation: 12.8 },
  cooked_porkchop: { hunger: 8, saturation: 12.8 },
  cooked_chicken: { hunger: 6, saturation: 7.2 },
  cookie: { hunger: 2, saturation: 0.4 },
  golden_apple: { hunger: 4, saturation: 9.6, alwaysEdible: true },
  enchanted_golden_apple: { hunger: 4, saturation: 9.6, alwaysEdible: true },
  golden_carrot: { hunger: 6, saturation: 14.4 },
  honey_bottle: { hunger: 6, saturation: 1.2, eatTicks: 40 },
  mushroom_stew: { hunger: 6, saturation: 7.2 },
  rabbit_stew: { hunger: 10, saturation: 12 },
  pumpkin_pie: { hunger: 8, saturation: 4.8 },
  rotten_flesh: { hunger: 4, saturation: 0.8 },
  potato: { hunger: 1, saturation: 0.6 },
  baked_potato: { hunger: 5, saturation: 6 },
  poisonous_potato: { hunger: 2, saturation: 1.2 },
  spider_eye: { hunger: 2, saturation: 3.2 },
  chorus_fruit: { hunger: 4, saturation: 2.4, alwaysEdible: true },
  beetroot_soup: { hunger: 6, saturation: 7.2 },
  dried_kelp: { hunger: 1, saturation: 0.6, eatTicks: 16 },
  sweet_berries: { hunger: 2, saturation: 0.4 },
  glow_berries: { hunger: 2, saturation: 0.4 },
};

export function foodValues(id: string): Food | undefined {
  return TABLE[id];
}

export function canEat(id: string, currentHunger: number, maxHunger: number): boolean {
  const f = TABLE[id];
  if (f === undefined) return false;
  return f.alwaysEdible === true || currentHunger < maxHunger;
}
