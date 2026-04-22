// Observer block. Detects block updates in front of it and emits a
// 1-tick (redstone game tick = 2 redstone ticks = 0.1s) pulse from its
// back. The pulse schedules the next tick, then returns to off.

export type Facing = 'up' | 'down' | 'north' | 'south' | 'east' | 'west';

export interface ObserverState {
  facing: Facing;
  powered: boolean;
  ticksUntilUnpower: number;
}

export function makeObserver(facing: Facing): ObserverState {
  return { facing, powered: false, ticksUntilUnpower: 0 };
}

const PULSE_DURATION_TICKS = 2;

export interface ObserverUpdate {
  blockInFrontChanged: boolean;
}

export interface ObserverTickResult {
  justFired: boolean;
  stillPowered: boolean;
}

// Called whenever the block in front is updated. Starts a pulse if we
// aren't already powered.
export function onBlockChange(state: ObserverState, u: ObserverUpdate): boolean {
  if (!u.blockInFrontChanged) return false;
  if (state.powered) return false;
  state.powered = true;
  state.ticksUntilUnpower = PULSE_DURATION_TICKS;
  return true;
}

// Tick the observer. Returns whether the observer just stopped firing.
export function tickObserver(state: ObserverState): ObserverTickResult {
  if (!state.powered) return { justFired: false, stillPowered: false };
  state.ticksUntilUnpower--;
  if (state.ticksUntilUnpower <= 0) {
    state.powered = false;
    return { justFired: true, stillPowered: false };
  }
  return { justFired: false, stillPowered: true };
}

// Offset of the block the observer "watches" from the observer's position.
export function watchedOffset(facing: Facing): { dx: number; dy: number; dz: number } {
  switch (facing) {
    case 'up':
      return { dx: 0, dy: 1, dz: 0 };
    case 'down':
      return { dx: 0, dy: -1, dz: 0 };
    case 'north':
      return { dx: 0, dy: 0, dz: -1 };
    case 'south':
      return { dx: 0, dy: 0, dz: 1 };
    case 'east':
      return { dx: 1, dy: 0, dz: 0 };
    case 'west':
      return { dx: -1, dy: 0, dz: 0 };
  }
}
