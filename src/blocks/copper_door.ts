// Copper doors / trapdoors / grates (1.21). Oxidation tier affects
// color; right-click toggles open state; redstone power mirrors the
// open/closed state (NOT rising-edge toggle like copper bulbs);
// waxed copper doors still respond to redstone — waxing only
// freezes oxidation, per wiki.
//
// Wiki (minecraft.wiki/w/Copper_Door): "When activated, the copper
// door immediately opens. When deactivated, it immediately closes.
// Players and mobs can still open and close a door that is
// controlled by a redstone signal."
//
// Wiki (minecraft.wiki/w/Copper_Bulb): "It toggles on or off when
// it receives a redstone pulse" — that's the BULB behavior, NOT
// the door. The bulb is the rising-edge toggle component.
//
// Old code used rising-edge toggle for the door (mistakenly aligned
// with the bulb), and refused power changes on waxed doors. Neither
// matches wiki canon.

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
  const wantOpen = power > 0;
  const changed = wantOpen !== state.open;
  state.lastPower = power;
  if (changed) state.open = wantOpen;
  return changed;
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
