// Copper grate (1.21). A non-solid, passable block that fluids flow
// through. Redstone signal passes through. Oxidizable like other copper.

export type OxidationStage = 'unoxidized' | 'exposed' | 'weathered' | 'oxidized';

export interface CopperGrateState {
  oxidation: OxidationStage;
  waxed: boolean;
}

export function makeCopperGrate(): CopperGrateState {
  return { oxidation: 'unoxidized', waxed: false };
}

// Grates are always passable; water / lava flow through them.
export function isPassable(): boolean {
  return true;
}

export function allowsFluidFlow(): boolean {
  return true;
}

export function oxidize(state: CopperGrateState): boolean {
  if (state.waxed) return false;
  if (state.oxidation === 'unoxidized') state.oxidation = 'exposed';
  else if (state.oxidation === 'exposed') state.oxidation = 'weathered';
  else if (state.oxidation === 'weathered') state.oxidation = 'oxidized';
  else return false;
  return true;
}

export function wax(state: CopperGrateState): boolean {
  if (state.waxed) return false;
  state.waxed = true;
  return true;
}
