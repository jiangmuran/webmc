// Furnace fuel burn times (seconds). Each item provides `seconds` of burn
// time; one smelt takes 10 seconds (200 ticks). Burn time ticks down while
// input is present.

export const BURN_TIMES: Record<string, number> = {
  'webmc:coal': 80,
  'webmc:charcoal': 80,
  'webmc:coal_block': 800,
  'webmc:dried_kelp_block': 200,
  'webmc:lava_bucket': 1000,
  'webmc:blaze_rod': 120,
  'webmc:stick': 5,
  'webmc:bamboo': 2.5,
  'webmc:oak_planks': 15,
  'webmc:oak_log': 15,
  'webmc:oak_sapling': 5,
  'webmc:oak_slab': 7.5,
  'webmc:oak_stairs': 15,
  'webmc:oak_fence': 15,
  'webmc:oak_fence_gate': 15,
  'webmc:oak_door': 10,
  'webmc:oak_pressure_plate': 15,
  'webmc:oak_button': 5,
  'webmc:oak_trapdoor': 15,
  'webmc:crafting_table': 15,
  'webmc:ladder': 15,
  'webmc:bowl': 5,
  'webmc:fishing_rod': 15,
  'webmc:wool': 5,
  'webmc:scaffolding': 2,
  'webmc:bookshelf': 15,
};

export const SMELT_DURATION_SEC = 10;

export function burnSecondsFor(item: string): number {
  return BURN_TIMES[item] ?? 0;
}

// How many smelt operations one unit of a fuel will power.
export function smeltsPerUnit(item: string): number {
  return burnSecondsFor(item) / SMELT_DURATION_SEC;
}

export function isFuel(item: string): boolean {
  return burnSecondsFor(item) > 0;
}

// A burning furnace state: seconds remaining.
export interface FurnaceBurnState {
  burnSecondsRemaining: number;
  maxBurnSeconds: number;
}

export function makeBurn(): FurnaceBurnState {
  return { burnSecondsRemaining: 0, maxBurnSeconds: 0 };
}

// Light the furnace using one unit of fuel. Returns true if the fuel was
// consumed; false if the furnace is already burning or item is not fuel.
export function igniteFurnace(state: FurnaceBurnState, fuel: string): boolean {
  if (state.burnSecondsRemaining > 0) return false;
  const sec = burnSecondsFor(fuel);
  if (sec <= 0) return false;
  state.burnSecondsRemaining = sec;
  state.maxBurnSeconds = sec;
  return true;
}

export function tickBurn(state: FurnaceBurnState, dtSec: number): void {
  state.burnSecondsRemaining = Math.max(0, state.burnSecondsRemaining - dtSec);
}
