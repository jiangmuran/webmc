// Pumpkin carving. Right-click a pumpkin with shears → carved_pumpkin
// (facing player) + drops 4 seeds. Placing a torch inside a carved
// pumpkin makes a jack-o-lantern (light 15).

export type PumpkinDirection = 'north' | 'south' | 'east' | 'west';

export interface CarvedPumpkinState {
  facing: PumpkinDirection;
  jack: boolean; // lit with a torch inside
}

export function carvePumpkin(facing: PumpkinDirection): {
  state: CarvedPumpkinState;
  seedDrops: number;
} {
  return { state: { facing, jack: false }, seedDrops: 4 };
}

export function makeJackOLantern(state: CarvedPumpkinState): boolean {
  if (state.jack) return false;
  state.jack = true;
  return true;
}

export function lightEmission(state: CarvedPumpkinState): number {
  return state.jack ? 15 : 0;
}

// Wearing a carved pumpkin on the head reduces enderman aggro from
// looking at them.
export function preventsEndermanAggro(headItem: string | null): boolean {
  return headItem === 'webmc:carved_pumpkin';
}
