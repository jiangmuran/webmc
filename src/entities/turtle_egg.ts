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

// Wiki (minecraft.wiki/w/Turtle_Egg): "Turtle eggs have a 1/500
// chance of cracking if they are randomly ticked during the day."
// And during the night (especially the 21062-21904 tick window)
// they crack/hatch reliably. Sibling turtle_egg_hatch.ts uses 1/500
// for day and 0.35 as a coarse night average. Old day-chance 0.02
// was 10× wiki canon, so daytime turtle-egg progression was way
// faster than canon.
export function hatchProgressChance(worldTick: number): number {
  const t = ((worldTick % DAY_TICKS) + DAY_TICKS) % DAY_TICKS;
  return t >= 13000 || t < 1000 ? 0.35 : 1 / 500;
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
