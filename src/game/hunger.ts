// Hunger exhaustion accumulator. Actions like sprinting, jumping,
// attacking, receiving damage add to an exhaustion meter; when it hits 4,
// 1 saturation (or 1 hunger if no sat) is consumed.

export interface HungerState {
  hunger: number; // 0..20
  saturation: number;
  exhaustion: number; // 0..40
}

const EXHAUSTION_LIMIT = 4;

export function makeHungerState(): HungerState {
  return { hunger: 20, saturation: 5, exhaustion: 0 };
}

export const EXHAUSTION_COSTS = {
  sprint_per_meter: 0.1,
  walk_per_meter: 0,
  swim_per_meter: 0.01,
  attack: 0.1,
  damage: 0.1,
  jump_regular: 0.05,
  jump_sprint: 0.2,
  mine_block: 0.005,
} as const;

export function addExhaustion(state: HungerState, amount: number): void {
  state.exhaustion += amount;
  while (state.exhaustion >= EXHAUSTION_LIMIT) {
    state.exhaustion -= EXHAUSTION_LIMIT;
    if (state.saturation > 0) {
      state.saturation = Math.max(0, state.saturation - 1);
    } else if (state.hunger > 0) {
      state.hunger = Math.max(0, state.hunger - 1);
    }
  }
}
