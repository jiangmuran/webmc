// Turtle eggs. Laid in sand near "home beach" of an adult turtle.
// Hatch stages 0..2 over ~2 days; accelerated at night. Baby turtle
// spawns from the last egg and drops scutes as it grows.

export interface TurtleEgg {
  count: number; // 1..4 in one block
  hatchStage: number; // 0..2
}

export const MAX_STAGE = 2;
export const DAY_TICKS = 24000;

export interface TickQuery {
  worldTick: number;
  rand: () => number;
}

// Each tick roll: 10% at night, 2% at day.
export function hatchProgressChance(worldTick: number): number {
  const t = ((worldTick % DAY_TICKS) + DAY_TICKS) % DAY_TICKS;
  return t >= 13000 || t < 1000 ? 0.1 : 0.02;
}

export interface TickResult {
  hatched: boolean;
  advanced: boolean;
}

export function tickEgg(e: TurtleEgg, q: TickQuery): TickResult {
  if (e.count <= 0) return { hatched: false, advanced: false };
  if (q.rand() >= hatchProgressChance(q.worldTick)) {
    return { hatched: false, advanced: false };
  }
  if (e.hatchStage < MAX_STAGE) {
    e.hatchStage += 1;
    return { hatched: false, advanced: true };
  }
  // last stage → hatch
  e.count = 0;
  return { hatched: true, advanced: true };
}

// Egg trampled by mob: chance 1/3 per step for zombies.
export const TRAMPLE_CHANCE = 1 / 3;

export function tryTrample(rand: () => number): boolean {
  return rand() < TRAMPLE_CHANCE;
}
