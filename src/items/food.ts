// Food registry — maps item name to hunger + saturation restore values.
// MC uses discrete integer "shanks" (half-drumsticks). We keep the same
// integer model; saturation can be float.

export interface FoodDef {
  name: string;
  hunger: number;
  saturation: number;
  // Eating duration in seconds (MC default 1.6).
  eatSec: number;
  // Effect applied on eat, if any.
  effect?: { id: string; amplifier: number; durationSec: number; chance?: number };
}

export const FOODS: Record<string, FoodDef> = {
  apple: { name: 'webmc:apple', hunger: 4, saturation: 2.4, eatSec: 1.6 },
  bread: { name: 'webmc:bread', hunger: 5, saturation: 6, eatSec: 1.6 },
  carrot: { name: 'webmc:carrot', hunger: 3, saturation: 3.6, eatSec: 1.6 },
  potato: { name: 'webmc:potato', hunger: 1, saturation: 0.6, eatSec: 1.6 },
  baked_potato: { name: 'webmc:baked_potato', hunger: 5, saturation: 6, eatSec: 1.6 },
  cooked_beef: { name: 'webmc:cooked_beef', hunger: 8, saturation: 12.8, eatSec: 1.6 },
  raw_beef: { name: 'webmc:raw_beef', hunger: 3, saturation: 1.8, eatSec: 1.6 },
  cooked_chicken: { name: 'webmc:cooked_chicken', hunger: 6, saturation: 7.2, eatSec: 1.6 },
  raw_chicken: {
    name: 'webmc:raw_chicken',
    hunger: 2,
    saturation: 1.2,
    eatSec: 1.6,
    effect: { id: 'hunger', amplifier: 0, durationSec: 30, chance: 0.3 },
  },
  cooked_porkchop: { name: 'webmc:cooked_porkchop', hunger: 8, saturation: 12.8, eatSec: 1.6 },
  raw_porkchop: { name: 'webmc:raw_porkchop', hunger: 3, saturation: 1.8, eatSec: 1.6 },
  cooked_mutton: { name: 'webmc:cooked_mutton', hunger: 6, saturation: 9.6, eatSec: 1.6 },
  raw_mutton: { name: 'webmc:raw_mutton', hunger: 2, saturation: 1.2, eatSec: 1.6 },
  cooked_rabbit: { name: 'webmc:cooked_rabbit', hunger: 5, saturation: 6, eatSec: 1.6 },
  raw_rabbit: { name: 'webmc:raw_rabbit', hunger: 3, saturation: 1.8, eatSec: 1.6 },
  cooked_fish: { name: 'webmc:cooked_fish', hunger: 5, saturation: 6, eatSec: 1.6 },
  raw_fish: { name: 'webmc:raw_fish', hunger: 2, saturation: 0.4, eatSec: 1.6 },
  cookie: { name: 'webmc:cookie', hunger: 2, saturation: 0.4, eatSec: 1.6 },
  melon_slice: { name: 'webmc:melon_slice', hunger: 2, saturation: 1.2, eatSec: 1.6 },
  pumpkin_pie: { name: 'webmc:pumpkin_pie', hunger: 8, saturation: 4.8, eatSec: 1.6 },
  golden_apple: {
    name: 'webmc:golden_apple',
    hunger: 4,
    saturation: 9.6,
    eatSec: 1.6,
    effect: { id: 'regeneration', amplifier: 1, durationSec: 5 },
  },
  enchanted_golden_apple: {
    name: 'webmc:enchanted_golden_apple',
    hunger: 4,
    saturation: 9.6,
    eatSec: 1.6,
    // Wiki (minecraft.wiki/w/Enchanted_Golden_Apple): "Regeneration II
    // for 20 seconds, Absorption IV for 2 minutes, Resistance I for
    // 5 minutes, Fire Resistance I for 5 minutes." This single-effect
    // record can only carry one entry — model it as the canonical
    // primary (Regeneration II / 20s); sibling
    // src/items/enchanted_golden_apple_buffs.ts already returns the
    // full 4-effect list. Old amplifier=4 (Regen V) / 30s was wrong
    // on both axes. Full multi-effect support pending an API change.
    effect: { id: 'regeneration', amplifier: 1, durationSec: 20 },
  },
  golden_carrot: { name: 'webmc:golden_carrot', hunger: 6, saturation: 14.4, eatSec: 1.6 },
  beetroot: { name: 'webmc:beetroot', hunger: 1, saturation: 1.2, eatSec: 1.6 },
  rotten_flesh: {
    name: 'webmc:rotten_flesh',
    hunger: 4,
    saturation: 0.8,
    eatSec: 1.6,
    effect: { id: 'hunger', amplifier: 0, durationSec: 30, chance: 0.8 },
  },
  spider_eye: {
    name: 'webmc:spider_eye',
    hunger: 2,
    saturation: 3.2,
    eatSec: 1.6,
    // Wiki (minecraft.wiki/w/Spider_Eye): "It also applies a Poison
    // effect lasting 5 seconds to the player, causing 4 damage."
    // Old durationSec: 4 was 1 second under wiki canon — sibling
    // src/entities/spider_eye_food.ts already uses 5s (100 ticks).
    effect: { id: 'poison', amplifier: 0, durationSec: 5, chance: 1 },
  },
};

export interface EdiblePlayer {
  hunger: number;
  saturation: number;
  eat(hungerRestore: number, saturationAdd: number): void;
  applyEffect?(id: string, amplifier: number, durationSec: number): void;
}

// Apply a food item to the player. Returns true on success; false if the
// player is already full (MC refuses to eat at 20/20 hunger).
export function applyFood(
  key: string,
  player: EdiblePlayer,
  rng: () => number = Math.random,
): boolean {
  const food = FOODS[key];
  if (!food) return false;
  if (
    player.hunger >= 20 &&
    food.name !== 'webmc:golden_apple' &&
    food.name !== 'webmc:enchanted_golden_apple'
  ) {
    return false;
  }
  player.eat(food.hunger, food.saturation);
  if (food.effect && player.applyEffect) {
    const chance = food.effect.chance ?? 1;
    if (rng() < chance) {
      player.applyEffect(food.effect.id, food.effect.amplifier, food.effect.durationSec);
    }
  }
  return true;
}

export function isFood(name: string): boolean {
  for (const f of Object.values(FOODS)) if (f.name === name) return true;
  return false;
}
