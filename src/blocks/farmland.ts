// Farmland hydration. Tilled dirt becomes farmland; water within 4
// blocks keeps it hydrated (moistureLevel = 7). Unhydrated farmland
// slowly dries out + reverts to dirt. Jumping on unhydrated reverts too.

export interface FarmlandState {
  moistureLevel: number; // 0..7
  isDry: boolean;
}

export function makeFarmland(initialMoisture = 0): FarmlandState {
  return { moistureLevel: initialMoisture, isDry: initialMoisture === 0 };
}

export interface FarmlandCtx {
  hasWaterWithin4: boolean;
  isRaining: boolean;
  dtSec: number;
}

export interface FarmlandTickResult {
  revertsToDirt: boolean;
}

const DRY_OUT_TICKS_SEC = 20; // empty moisture takes ~20s to revert

export function tickFarmland(state: FarmlandState, ctx: FarmlandCtx): FarmlandTickResult {
  if (ctx.hasWaterWithin4 || ctx.isRaining) {
    state.moistureLevel = 7;
    state.isDry = false;
    return { revertsToDirt: false };
  }
  state.moistureLevel = Math.max(0, state.moistureLevel - ctx.dtSec / (DRY_OUT_TICKS_SEC / 7));
  state.isDry = state.moistureLevel === 0;
  if (state.moistureLevel <= 0) {
    return { revertsToDirt: true };
  }
  return { revertsToDirt: false };
}

// Jumping from ≥ 3 blocks onto unhydrated farmland reverts it.
export function jumpTrample(state: FarmlandState, fallBlocks: number): boolean {
  if (fallBlocks < 3) return false;
  state.moistureLevel = 0;
  state.isDry = true;
  return true;
}
