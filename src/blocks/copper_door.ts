// Copper doors / trapdoors / grates (1.21). Oxidation tier affects color;
// right-click toggles open state; redstone power toggles only on rising
// edge (matches copper bulb semantics); waxed copper doors don't accept
// right-click to open — MC says they do accept player interaction but
// refuse power toggles. We match that.

export type OxidationStage = 'unoxidized' | 'exposed' | 'weathered' | 'oxidized';

export interface CopperDoorState {
  open: boolean;
  oxidation: OxidationStage;
  waxed: boolean;
  lastPower: number;
}

export function makeCopperDoor(): CopperDoorState {
  return { open: false, oxidation: 'unoxidized', waxed: false, lastPower: 0 };
}

export function rightClickOpen(state: CopperDoorState): boolean {
  state.open = !state.open;
  return state.open;
}

export function updateCopperPower(state: CopperDoorState, power: number): boolean {
  const rising = state.lastPower === 0 && power > 0;
  state.lastPower = power;
  if (rising && !state.waxed) {
    state.open = !state.open;
    return true;
  }
  return false;
}

export function oxidizeOneStage(state: CopperDoorState): boolean {
  if (state.waxed) return false;
  if (state.oxidation === 'unoxidized') state.oxidation = 'exposed';
  else if (state.oxidation === 'exposed') state.oxidation = 'weathered';
  else if (state.oxidation === 'weathered') state.oxidation = 'oxidized';
  else return false;
  return true;
}

export function waxCopperDoor(state: CopperDoorState): boolean {
  if (state.waxed) return false;
  state.waxed = true;
  return true;
}
