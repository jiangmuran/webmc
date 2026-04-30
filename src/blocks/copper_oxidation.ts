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

// Wiki (minecraft.wiki/w/Oxidation): "A lightning bolt striking a
// non-waxed copper block removes all oxidation from the block, and
// may also deoxidize randomly selected copper blocks nearby."
//
// Lightning DEOXIDIZES (resets stage to 'regular'), it does NOT
// advance. And it has no effect on WAXED copper blocks. Old code:
//   - Unwaxed waxed blocks (wiki: lightning doesn't touch waxed)
//   - Advanced one stage (wiki: removes ALL oxidation, all the way
//     back to 'regular')
// Both behaviours were inverse of canon. Now matches wiki:
// non-waxed → reset to 'regular'; waxed → no-op.
export function lightningStrike(state: CopperState): void {
  if (state.waxed) return;
  state.stage = 'regular';
}

export function asBlockId(base: string, state: CopperState): string {
  const prefix = state.waxed ? 'waxed_' : '';
  const stagePart = state.stage === 'regular' ? base : `${state.stage}_${base}`;
  return `webmc:${prefix}${stagePart}`;
}
