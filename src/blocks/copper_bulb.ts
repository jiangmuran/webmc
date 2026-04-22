// Copper bulb (1.21). Toggled by a redstone edge rather than a level — each
// rising edge flips the lit state. Oxidation stages change the light
// emission.

export type OxidationStage = 'unoxidized' | 'exposed' | 'weathered' | 'oxidized';

const LIGHT_EMISSION: Record<OxidationStage, { lit: number; unlit: number }> = {
  unoxidized: { lit: 15, unlit: 0 },
  exposed: { lit: 12, unlit: 0 },
  weathered: { lit: 8, unlit: 0 },
  oxidized: { lit: 4, unlit: 0 },
};

export interface CopperBulbState {
  lit: boolean;
  lastPower: number;
  oxidation: OxidationStage;
  waxed: boolean; // waxed bulbs do not oxidize further
}

export function makeCopperBulb(): CopperBulbState {
  return { lit: false, lastPower: 0, oxidation: 'unoxidized', waxed: false };
}

// Accepts a redstone power level (0..15) each tick; flips `lit` on a
// rising edge.
export function updatePower(state: CopperBulbState, power: number): boolean {
  const rising = state.lastPower === 0 && power > 0;
  state.lastPower = power;
  if (rising) {
    state.lit = !state.lit;
    return true;
  }
  return false;
}

export function lightEmission(state: CopperBulbState): number {
  const emission = LIGHT_EMISSION[state.oxidation];
  return state.lit ? emission.lit : emission.unlit;
}

export function oxidizeOneStage(state: CopperBulbState): boolean {
  if (state.waxed) return false;
  if (state.oxidation === 'unoxidized') state.oxidation = 'exposed';
  else if (state.oxidation === 'exposed') state.oxidation = 'weathered';
  else if (state.oxidation === 'weathered') state.oxidation = 'oxidized';
  else return false;
  return true;
}

export function waxCopperBulb(state: CopperBulbState): boolean {
  if (state.waxed) return false;
  state.waxed = true;
  return true;
}
