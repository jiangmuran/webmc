// Furnace smelt progress. Takes 200 ticks (10s) per item with 1 fuel
// unit (= 200 burn ticks for coal, variable others). Output slot
// stacks if same id.

export interface FurnaceState {
  fuelTicksRemaining: number;
  smeltTicksElapsed: number;
  inputId: string | null;
  outputId: string | null;
  outputCount: number;
}

export const SMELT_TICKS_PER_ITEM = 200;

export function makeFurnace(): FurnaceState {
  return {
    fuelTicksRemaining: 0,
    smeltTicksElapsed: 0,
    inputId: null,
    outputId: null,
    outputCount: 0,
  };
}

export interface FuelItem {
  id: string;
  burnTicks: number;
}

export function addFuel(f: FurnaceState, fuel: FuelItem): boolean {
  if (f.fuelTicksRemaining > 0) return false;
  f.fuelTicksRemaining = fuel.burnTicks;
  return true;
}

export interface SmeltTickQuery {
  recipeOutputId: string | null;
}

export interface TickResult {
  completedOneItem: boolean;
}

export function tickFurnace(f: FurnaceState, q: SmeltTickQuery): TickResult {
  if (f.fuelTicksRemaining > 0) f.fuelTicksRemaining -= 1;
  if (!f.inputId || !q.recipeOutputId) {
    f.smeltTicksElapsed = 0;
    return { completedOneItem: false };
  }
  if (f.fuelTicksRemaining === 0) return { completedOneItem: false };
  f.smeltTicksElapsed += 1;
  if (f.smeltTicksElapsed >= SMELT_TICKS_PER_ITEM) {
    f.smeltTicksElapsed = 0;
    if (f.outputId === null || f.outputId === q.recipeOutputId) {
      f.outputId = q.recipeOutputId;
      f.outputCount += 1;
      return { completedOneItem: true };
    }
  }
  return { completedOneItem: false };
}

export const FUEL_BURN_TICKS: Record<string, number> = {
  'webmc:coal': 1600,
  'webmc:charcoal': 1600,
  'webmc:coal_block': 16000,
  'webmc:lava_bucket': 20000,
  'webmc:blaze_rod': 2400,
  'webmc:oak_log': 300,
  'webmc:oak_planks': 300,
  'webmc:stick': 100,
};

export function burnTicksFor(id: string): number {
  return FUEL_BURN_TICKS[id] ?? 0;
}
