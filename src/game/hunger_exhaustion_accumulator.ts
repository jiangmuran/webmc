export const MAX_FOOD = 20;
export const EXHAUSTION_THRESHOLD = 4;

export interface HungerState {
  food: number;
  saturation: number;
  exhaustion: number;
}

export const EXHAUSTION_COSTS = {
  walk: 0.0,
  sprint_meter: 0.1,
  swim_meter: 0.01,
  jump: 0.05,
  sprint_jump: 0.2,
  attack: 0.1,
  mine_block: 0.005,
  damage: 0.1,
} as const;

export function accumulate(s: HungerState, amount: number): HungerState {
  let exhaustion = s.exhaustion + amount;
  let saturation = s.saturation;
  let food = s.food;
  while (exhaustion >= EXHAUSTION_THRESHOLD) {
    exhaustion -= EXHAUSTION_THRESHOLD;
    if (saturation > 0) {
      saturation = Math.max(0, saturation - 1);
    } else {
      food = Math.max(0, food - 1);
    }
  }
  return { food, saturation, exhaustion };
}

export function regen(s: HungerState): HungerState {
  if (s.food >= 18 && s.saturation > 0) {
    return accumulate(s, EXHAUSTION_THRESHOLD);
  }
  return s;
}
