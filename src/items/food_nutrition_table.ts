export interface Food {
  hunger: number;
  saturation: number;
  alwaysEdible?: boolean;
  eatTicks?: number;
}

// Wiki: minecraft.wiki/w/Food#Hunger_restored. Values verified
// against the Java Edition food table; missing entries from earlier
// pass added below (raw/cooked meats, fish, melon, beetroot,
// suspicious_stew).
const TABLE: Record<string, Food> = {
  apple: { hunger: 4, saturation: 2.4 },
  bread: { hunger: 5, saturation: 6 },
  carrot: { hunger: 3, saturation: 3.6 },
  beetroot: { hunger: 1, saturation: 1.2 },
  potato: { hunger: 1, saturation: 0.6 },
  baked_potato: { hunger: 5, saturation: 6 },
  poisonous_potato: { hunger: 2, saturation: 1.2 },
  beef: { hunger: 3, saturation: 1.8 },
  cooked_beef: { hunger: 8, saturation: 12.8 },
  porkchop: { hunger: 3, saturation: 1.8 },
  cooked_porkchop: { hunger: 8, saturation: 12.8 },
  chicken: { hunger: 2, saturation: 1.2 },
  cooked_chicken: { hunger: 6, saturation: 7.2 },
  rabbit: { hunger: 3, saturation: 1.8 },
  cooked_rabbit: { hunger: 5, saturation: 6 },
  mutton: { hunger: 2, saturation: 1.2 },
  cooked_mutton: { hunger: 6, saturation: 9.6 },
  cod: { hunger: 2, saturation: 0.4 },
  cooked_cod: { hunger: 5, saturation: 6 },
  salmon: { hunger: 2, saturation: 0.4 },
  cooked_salmon: { hunger: 6, saturation: 9.6 },
  tropical_fish: { hunger: 1, saturation: 0.2 },
  pufferfish: { hunger: 1, saturation: 0.2 },
  cookie: { hunger: 2, saturation: 0.4 },
  melon_slice: { hunger: 2, saturation: 1.2 },
  golden_apple: { hunger: 4, saturation: 9.6, alwaysEdible: true },
  enchanted_golden_apple: { hunger: 4, saturation: 9.6, alwaysEdible: true },
  golden_carrot: { hunger: 6, saturation: 14.4 },
  honey_bottle: { hunger: 6, saturation: 1.2, eatTicks: 40 },
  mushroom_stew: { hunger: 6, saturation: 7.2 },
  rabbit_stew: { hunger: 10, saturation: 12 },
  beetroot_soup: { hunger: 6, saturation: 7.2 },
  suspicious_stew: { hunger: 6, saturation: 7.2 },
  pumpkin_pie: { hunger: 8, saturation: 4.8 },
  rotten_flesh: { hunger: 4, saturation: 0.8 },
  spider_eye: { hunger: 2, saturation: 3.2 },
  chorus_fruit: { hunger: 4, saturation: 2.4, alwaysEdible: true },
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
