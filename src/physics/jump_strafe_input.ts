export interface MovementInput {
  forward: number;
  strafe: number;
  jumping: boolean;
  sneaking: boolean;
  sprinting: boolean;
}

export const BASE_WALK_SPEED = 0.1;
export const SPRINT_MULTIPLIER = 1.3;
export const SNEAK_MULTIPLIER = 0.3;

export function movementVelocity(m: MovementInput, yaw: number): { vx: number; vz: number } {
  let speed = BASE_WALK_SPEED;
  if (m.sneaking) speed *= SNEAK_MULTIPLIER;
  if (m.sprinting && !m.sneaking) speed *= SPRINT_MULTIPLIER;
  const sin = Math.sin(yaw);
  const cos = Math.cos(yaw);
  return {
    vx: (m.forward * sin + m.strafe * cos) * speed,
    vz: (m.forward * cos - m.strafe * sin) * speed,
  };
}

export const JUMP_VELOCITY = 0.42;

export function jumpVelocity(jumpBoostLevel: number): number {
  return JUMP_VELOCITY + jumpBoostLevel * 0.1;
}
