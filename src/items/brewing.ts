// Brewing stand tile-entity state. 3 output slots (bottom) + 1 ingredient
// slot (top) + 1 fuel slot (blaze powder). Applying the ingredient to each
// bottle advances a 20-second brew timer; on completion, each bottle
// transforms into the output potion.

import { brewResult } from './potion';

export interface BottleSlot {
  contents: string | null; // potion key ('water_bottle' / 'awkward' / named potion) or null
}

export interface BrewingState {
  bottles: [BottleSlot, BottleSlot, BottleSlot];
  ingredient: string | null; // item name
  fuelPower: number; // 0..20; each blaze powder gives +20
  progressSec: number;
}

export function makeBrewingStand(): BrewingState {
  return {
    bottles: [{ contents: null }, { contents: null }, { contents: null }],
    ingredient: null,
    fuelPower: 0,
    progressSec: 0,
  };
}

export const BREW_TOTAL_SEC = 20;

// Add a blaze powder; returns true on success.
export function addFuel(state: BrewingState): boolean {
  if (state.fuelPower >= 20) return false;
  state.fuelPower = Math.min(20, state.fuelPower + 1);
  return true;
}

export interface BrewTickResult {
  changedBottles: boolean;
  ingredientConsumed: boolean;
}

export function tickBrewing(state: BrewingState, dtSec: number): BrewTickResult {
  if (!state.ingredient) {
    state.progressSec = 0;
    return { changedBottles: false, ingredientConsumed: false };
  }
  if (state.fuelPower <= 0) return { changedBottles: false, ingredientConsumed: false };
  // Need at least one brewable bottle.
  let anyBrewable = false;
  for (const b of state.bottles) {
    if (b.contents !== null && brewResult(b.contents, state.ingredient) !== null) {
      anyBrewable = true;
      break;
    }
  }
  if (!anyBrewable) {
    state.progressSec = 0;
    return { changedBottles: false, ingredientConsumed: false };
  }
  state.progressSec += dtSec;
  if (state.progressSec < BREW_TOTAL_SEC) {
    return { changedBottles: false, ingredientConsumed: false };
  }
  // Complete the brew.
  let changed = false;
  for (const b of state.bottles) {
    if (b.contents === null) continue;
    const out = brewResult(b.contents, state.ingredient);
    if (out !== null) {
      b.contents = out;
      changed = true;
    }
  }
  state.ingredient = null;
  state.fuelPower -= 1;
  state.progressSec = 0;
  return { changedBottles: changed, ingredientConsumed: true };
}
