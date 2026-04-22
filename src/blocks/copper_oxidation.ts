// Copper oxidation chain. A copper block (or copper door, bulb, grate,
// stairs, slab) progresses over time through 4 stages; axe/scrape reverts
// one stage; wax locks the current stage.

export type OxidationStage = 'regular' | 'exposed' | 'weathered' | 'oxidized';

const STAGE_ORDER: readonly OxidationStage[] = ['regular', 'exposed', 'weathered', 'oxidized'];

export interface CopperState {
  stage: OxidationStage;
  waxed: boolean;
}

export function makeCopper(): CopperState {
  return { stage: 'regular', waxed: false };
}

// Returns true if the stage advanced. Waxed copper and fully oxidized
// copper never advance. In MC each block has ~1/64 chance per random tick;
// we accept a pre-rolled probability.
export function tickOxidation(state: CopperState, roll: number): boolean {
  if (state.waxed) return false;
  const idx = STAGE_ORDER.indexOf(state.stage);
  if (idx < 0 || idx >= STAGE_ORDER.length - 1) return false;
  const CHANCE_PER_TICK = 1 / 64;
  if (roll >= CHANCE_PER_TICK) return false;
  const next = STAGE_ORDER[idx + 1];
  if (!next) return false;
  state.stage = next;
  return true;
}

// Axe scrape on copper: reverses one stage. Waxed copper is unwaxed first.
// Returns true if something changed.
export function scrape(state: CopperState): boolean {
  if (state.waxed) {
    state.waxed = false;
    return true;
  }
  const idx = STAGE_ORDER.indexOf(state.stage);
  if (idx <= 0) return false;
  const prev = STAGE_ORDER[idx - 1];
  if (!prev) return false;
  state.stage = prev;
  return true;
}

// Wax locks the current stage. Honeycomb is consumed externally.
export function wax(state: CopperState): boolean {
  if (state.waxed) return false;
  state.waxed = true;
  return true;
}

// Lightning striking a waxed block strips the wax AND advances one stage
// (lightning accelerates oxidation in MC, but only unwaxed; here we model
// the whole step deterministically).
export function lightningStrike(state: CopperState): void {
  state.waxed = false;
  const idx = STAGE_ORDER.indexOf(state.stage);
  if (idx < 0 || idx >= STAGE_ORDER.length - 1) return;
  const next = STAGE_ORDER[idx + 1];
  if (next) state.stage = next;
}

export function asBlockId(base: string, state: CopperState): string {
  const prefix = state.waxed ? 'waxed_' : '';
  const stagePart = state.stage === 'regular' ? base : `${state.stage}_${base}`;
  return `webmc:${prefix}${stagePart}`;
}
