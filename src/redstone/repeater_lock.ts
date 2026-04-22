// Repeater locking. A powered repeater on the side of another repeater
// (or comparator) freezes that output in its current state until the
// side input stops. Useful for edge-triggered latches.

export type Facing = 'north' | 'south' | 'east' | 'west';

export interface RepeaterInputs {
  rearSignal: number; // 0..15
  leftSideSignal: number; // if > 0, lock
  rightSideSignal: number;
}

export interface RepeaterLockState {
  locked: boolean;
  lockedOutput: number;
  lastOutput: number;
}

export function makeRepeaterLockState(): RepeaterLockState {
  return { locked: false, lockedOutput: 0, lastOutput: 0 };
}

export interface LockTickResult {
  output: number;
  lockChanged: boolean;
}

export function tickLock(state: RepeaterLockState, inputs: RepeaterInputs): LockTickResult {
  const sideLocked = inputs.leftSideSignal > 0 || inputs.rightSideSignal > 0;
  const wasLocked = state.locked;
  if (sideLocked && !state.locked) {
    state.locked = true;
    state.lockedOutput = state.lastOutput;
  } else if (!sideLocked && state.locked) {
    state.locked = false;
  }
  const output = state.locked ? state.lockedOutput : inputs.rearSignal > 0 ? 15 : 0;
  state.lastOutput = output;
  return { output, lockChanged: wasLocked !== state.locked };
}

// Only powered repeaters / comparators on the sides count as "locking".
// Other blocks with redstone power are ignored by the lock logic.
export type SideBlock = 'repeater' | 'comparator' | 'none';

export interface ValidLockSide {
  block: SideBlock;
  powered: boolean;
  facesIntoCenter: boolean;
}

export function isLockingSide(side: ValidLockSide): boolean {
  if (side.block === 'none') return false;
  if (!side.powered) return false;
  return side.facesIntoCenter;
}
