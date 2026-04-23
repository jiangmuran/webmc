// Jump impulse calculation. Base jump = 0.42; sprinting adds ~0.2
// horizontal boost; jump boost effect adds vertical.

export const JUMP_VELOCITY = 0.42;
export const SPRINT_JUMP_HORIZONTAL_BOOST = 0.2;

export interface JumpCtx {
  sprinting: boolean;
  jumpBoostLevel: number; // potion amplifier, -1 for slowness negative
  inWater: boolean;
  inLava: boolean;
}

export function jumpVelocityY(c: JumpCtx): number {
  if (c.inWater || c.inLava) return 0; // swim-up handled elsewhere
  return JUMP_VELOCITY + 0.1 * c.jumpBoostLevel;
}

export function sprintJumpBoost(c: JumpCtx, yaw: number): { dx: number; dz: number } {
  if (!c.sprinting) return { dx: 0, dz: 0 };
  return {
    dx: -Math.sin(yaw) * SPRINT_JUMP_HORIZONTAL_BOOST,
    dz: Math.cos(yaw) * SPRINT_JUMP_HORIZONTAL_BOOST,
  };
}
