// Spider eye food. Eating restores 2 hunger but applies Poison II for
// 5 seconds (food poisoning). Used in recipes.

export const SPIDER_EYE_HUNGER = 2;
export const SPIDER_EYE_SATURATION = 3.2;
export const POISON_DURATION_TICKS = 100; // 5 s
export const POISON_AMPLIFIER = 0;

export interface EatResult {
  hunger: number;
  saturation: number;
  debuffs: { id: string; amplifier: number; durationTicks: number }[];
}

export function eatSpiderEye(): EatResult {
  return {
    hunger: SPIDER_EYE_HUNGER,
    saturation: SPIDER_EYE_SATURATION,
    debuffs: [{ id: 'poison', amplifier: POISON_AMPLIFIER, durationTicks: POISON_DURATION_TICKS }],
  };
}

// Pufferfish is worse: 1 hunger, Hunger III for 15s, Poison II for 60s,
// Nausea I for 15s.
export interface PufferEatResult {
  hunger: number;
  debuffs: { id: string; amplifier: number; durationTicks: number }[];
}

export function eatPufferfish(): PufferEatResult {
  return {
    hunger: 1,
    debuffs: [
      { id: 'hunger', amplifier: 2, durationTicks: 300 },
      { id: 'poison', amplifier: 1, durationTicks: 1200 },
      { id: 'nausea', amplifier: 0, durationTicks: 300 },
    ],
  };
}
