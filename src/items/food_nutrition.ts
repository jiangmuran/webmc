export interface FoodValue {
  hunger: number;
  saturation: number;
  eatTimeTicks: number;
  canAlwaysEat?: boolean;
}

export const TABLE: Record<string, FoodValue> = {
  apple: { hunger: 4, saturation: 2.4, eatTimeTicks: 32 },
  baked_potato: { hunger: 5, saturation: 6, eatTimeTicks: 32 },
  beef: { hunger: 3, saturation: 1.8, eatTimeTicks: 32 },
  cooked_beef: { hunger: 8, saturation: 12.8, eatTimeTicks: 32 },
  bread: { hunger: 5, saturation: 6, eatTimeTicks: 32 },
  carrot: { hunger: 3, saturation: 3.6, eatTimeTicks: 32 },
  chicken: { hunger: 2, saturation: 1.2, eatTimeTicks: 32 },
  cooked_chicken: { hunger: 6, saturation: 7.2, eatTimeTicks: 32 },
  cookie: { hunger: 2, saturation: 0.4, eatTimeTicks: 32 },
  golden_apple: { hunger: 4, saturation: 9.6, eatTimeTicks: 32, canAlwaysEat: true },
  golden_carrot: { hunger: 6, saturation: 14.4, eatTimeTicks: 32 },
  porkchop: { hunger: 3, saturation: 1.8, eatTimeTicks: 32 },
  cooked_porkchop: { hunger: 8, saturation: 12.8, eatTimeTicks: 32 },
  potato: { hunger: 1, saturation: 0.6, eatTimeTicks: 32 },
  pumpkin_pie: { hunger: 8, saturation: 4.8, eatTimeTicks: 32 },
  rabbit: { hunger: 3, saturation: 1.8, eatTimeTicks: 32 },
  cooked_rabbit: { hunger: 5, saturation: 6, eatTimeTicks: 32 },
  rabbit_stew: { hunger: 10, saturation: 12, eatTimeTicks: 32 },
  rotten_flesh: { hunger: 4, saturation: 0.8, eatTimeTicks: 32 },
  salmon: { hunger: 2, saturation: 0.4, eatTimeTicks: 32 },
  cooked_salmon: { hunger: 6, saturation: 9.6, eatTimeTicks: 32 },
  cod: { hunger: 2, saturation: 0.4, eatTimeTicks: 32 },
  cooked_cod: { hunger: 5, saturation: 6, eatTimeTicks: 32 },
  tropical_fish: { hunger: 1, saturation: 0.2, eatTimeTicks: 32 },
  pufferfish: { hunger: 1, saturation: 0.2, eatTimeTicks: 32 },
  beetroot: { hunger: 1, saturation: 1.2, eatTimeTicks: 32 },
  beetroot_soup: { hunger: 6, saturation: 7.2, eatTimeTicks: 32 },
  mushroom_stew: { hunger: 6, saturation: 7.2, eatTimeTicks: 32 },
  suspicious_stew: { hunger: 6, saturation: 7.2, eatTimeTicks: 32 },
  sweet_berries: { hunger: 2, saturation: 0.4, eatTimeTicks: 32 },
  glow_berries: { hunger: 2, saturation: 0.4, eatTimeTicks: 32 },
};

export function foodOf(id: string): FoodValue | undefined {
  return TABLE[id];
}

export function canEatAtFull(id: string): boolean {
  return TABLE[id]?.canAlwaysEat === true;
}
