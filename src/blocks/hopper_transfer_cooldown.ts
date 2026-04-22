// Hopper transfer cooldown. 8 ticks between transfers. Disabled when
// powered by redstone.

export interface HopperState {
  cooldownTicksRemaining: number;
  powered: boolean;
}

export const COOLDOWN_TICKS = 8;

export function makeHopper(): HopperState {
  return { cooldownTicksRemaining: 0, powered: false };
}

export function setPowered(h: HopperState, powered: boolean): void {
  h.powered = powered;
}

export interface TickResult {
  canTransfer: boolean;
}

export function tickHopper(h: HopperState): TickResult {
  if (h.cooldownTicksRemaining > 0) h.cooldownTicksRemaining -= 1;
  if (h.powered) return { canTransfer: false };
  return { canTransfer: h.cooldownTicksRemaining === 0 };
}

export function afterTransfer(h: HopperState): void {
  h.cooldownTicksRemaining = COOLDOWN_TICKS;
}

// Input side: hopper connects to another hopper pointing at it, or
// any container above.
export type HopperDir = 'down' | 'north' | 'south' | 'east' | 'west';
