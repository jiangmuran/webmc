// Fence gate open/close + powered state. Gates open when right-clicked
// or when receiving redstone power. Gates also "flip" open to align with
// the direction they were first clicked from, so opening from the south
// faces the player properly.

export type Facing = 'north' | 'south' | 'east' | 'west';

export interface FenceGateState {
  facing: Facing;
  open: boolean;
  inWall: boolean; // MC: gate lowers to fit wall height
  powered: boolean;
}

export function makeFenceGate(facing: Facing): FenceGateState {
  return { facing, open: false, inWall: false, powered: false };
}

export interface InteractQuery {
  state: FenceGateState;
  playerFacing: Facing;
}

export function interactGate(q: InteractQuery): boolean {
  const s = q.state;
  if (!s.open) {
    // Adjust facing so the gate opens toward the player.
    if (q.playerFacing !== s.facing && q.playerFacing !== oppositeFacing(s.facing)) {
      // perpendicular click — keep facing
    } else {
      s.facing = q.playerFacing === s.facing ? s.facing : oppositeFacing(s.facing);
    }
    s.open = true;
    return true;
  }
  s.open = false;
  return true;
}

export function setPower(state: FenceGateState, powered: boolean): boolean {
  if (state.powered === powered) return false;
  state.powered = powered;
  state.open = powered;
  return true;
}

export function setInWall(state: FenceGateState, inWall: boolean): void {
  state.inWall = inWall;
}

function oppositeFacing(f: Facing): Facing {
  switch (f) {
    case 'north':
      return 'south';
    case 'south':
      return 'north';
    case 'east':
      return 'west';
    case 'west':
      return 'east';
  }
}

// Mobs can path through open gates but not closed ones.
export function canPathThrough(state: FenceGateState): boolean {
  return state.open;
}

// Fence gate connects to fences only when sharing facing axis.
export function connectsToFenceOn(state: FenceGateState, dir: Facing): boolean {
  if (state.facing === 'north' || state.facing === 'south') {
    return dir === 'east' || dir === 'west';
  }
  return dir === 'north' || dir === 'south';
}
