// Ladders. Placed on any solid side. Entities on a ladder climb up/down
// at reduced horizontal speed. Requires solid backing.

export interface LadderState {
  facing: 'north' | 'south' | 'east' | 'west';
  waterlogged: boolean;
}

export interface LadderCtx {
  onLadder: boolean;
  inputUp: boolean;
  inputDown: boolean;
  isSneaking: boolean;
}

export const LADDER_CLIMB_SPEED = 0.12;
export const LADDER_DESCEND_SPEED = 0.15;

export function verticalVelocity(c: LadderCtx): number {
  if (!c.onLadder) return 0;
  if (c.isSneaking) return 0;
  if (c.inputUp) return LADDER_CLIMB_SPEED;
  if (c.inputDown) return -LADDER_DESCEND_SPEED;
  // Stationary grip: no gravity while holding the ladder.
  return 0;
}

export function supportsFromSolidBacking(backingIsSolid: boolean): boolean {
  return backingIsSolid;
}

export function preventsFallDamage(): boolean {
  return true;
}
