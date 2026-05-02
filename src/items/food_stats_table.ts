// Food stats table: hunger points + saturation + eating time.

export interface FoodStats {
  hunger: number; // half-shanks restored
  saturation: number; // ratio of saturation refill
  eatTicks: number; // duration of use
  alwaysEdible: boolean;
}

const TABLE: Record<string, FoodStats> = {
  apple: { hunger: 4, saturation: 2.4, eatTicks: 32, alwaysEdible: false },
  bread: { hunger: 5, saturation: 6, eatTicks: 32, alwaysEdible: false },
  cooked_beef: { hunger: 8, saturation: 12.8, eatTicks: 32, alwaysEdible: false },
  cooked_chicken: { hunger: 6, saturation: 7.2, eatTicks: 32, alwaysEdible: false },
  golden_apple: { hunger: 4, saturation: 9.6, eatTicks: 32, alwaysEdible: true },
  enchanted_golden_apple: { hunger: 4, saturation: 9.6, eatTicks: 32, alwaysEdible: true },
  rotten_flesh: { hunger: 4, saturation: 0.8, eatTicks: 32, alwaysEdible: false },
  spider_eye: { hunger: 2, saturation: 3.2, eatTicks: 32, alwaysEdible: false },
  poisonous_potato: { hunger: 2, saturation: 1.2, eatTicks: 32, alwaysEdible: false },
  chorus_fruit: { hunger: 4, saturation: 2.4, eatTicks: 32, alwaysEdible: true },
  cake_slice: { hunger: 2, saturation: 0.4, eatTicks: 1, alwaysEdible: false },
  honey_bottle: { hunger: 6, saturation: 1.2, eatTicks: 40, alwaysEdible: false },
};

export function statsFor(id: string): FoodStats | null {
  return TABLE[id] ?? null;
}

export function canEat(id: string, playerHungerPct: number): boolean {
  const s = TABLE[id];
  if (!s) return false;
  return s.alwaysEdible || playerHungerPct < 1;
}

// Wiki references:
//   minecraft.wiki/w/Golden_Apple — Regen II 5s, Absorption I 2 min
//   minecraft.wiki/w/Enchanted_Golden_Apple — Regen II 20s,
//     Absorption IV 2 min, Resistance I 5 min, Fire Resistance I 5 min
//   minecraft.wiki/w/Rotten_Flesh — Hunger 30s, 80% chance (chance is
//     applied at call site)
//   minecraft.wiki/w/Spider_Eye — Poison 5s
//   minecraft.wiki/w/Pufferfish — eating raw inflicts Hunger III for
//     15s (300 ticks, amp 2), Poison II for 60s (1200 ticks, amp 1),
//     Nausea for 15s (300 ticks, amp 0). Old code returned no
//     effects for pufferfish — players could eat raw pufferfish for
//     free hunger restore, missing the wiki's signature triple-debuff.
export function postEatEffects(
  id: string,
): { id: string; durationTicks: number; amplifier: number }[] {
  if (id === 'rotten_flesh') return [{ id: 'hunger', durationTicks: 600, amplifier: 0 }];
  if (id === 'spider_eye') return [{ id: 'poison', durationTicks: 100, amplifier: 0 }];
  if (id === 'pufferfish')
    return [
      { id: 'hunger', durationTicks: 300, amplifier: 2 },
      { id: 'poison', durationTicks: 1200, amplifier: 1 },
      { id: 'nausea', durationTicks: 300, amplifier: 0 },
    ];
  if (id === 'golden_apple')
    return [
      { id: 'regeneration', durationTicks: 100, amplifier: 1 },
      { id: 'absorption', durationTicks: 2400, amplifier: 0 },
    ];
  if (id === 'enchanted_golden_apple')
    return [
      { id: 'regeneration', durationTicks: 400, amplifier: 1 },
      { id: 'absorption', durationTicks: 2400, amplifier: 3 },
      { id: 'resistance', durationTicks: 6000, amplifier: 0 },
      { id: 'fire_resistance', durationTicks: 6000, amplifier: 0 },
    ];
  return [];
}
