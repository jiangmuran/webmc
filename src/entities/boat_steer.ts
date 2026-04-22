// Boat steering. Two paddles, left and right: both forward → straight,
// one forward → turn. Speed on ice is much higher; on water it's
// 0.4 blk/tick at peak.

export interface BoatState {
  forwardVel: number;
  yaw: number;
  leftPaddle: boolean;
  rightPaddle: boolean;
  onIce: boolean;
  onWater: boolean;
}

export const PADDLE_ACCEL = 0.04;
export const WATER_MAX = 0.4;
export const ICE_MAX = 0.9;
export const DRAG_WATER = 0.9;
export const DRAG_ICE = 0.98;
export const TURN_PER_TICK_DEG = 3;

export function tickBoat(b: BoatState): void {
  const both = b.leftPaddle && b.rightPaddle;
  if (both) b.forwardVel += PADDLE_ACCEL;
  else if (b.leftPaddle) {
    b.yaw += TURN_PER_TICK_DEG;
    b.forwardVel += PADDLE_ACCEL * 0.3;
  } else if (b.rightPaddle) {
    b.yaw -= TURN_PER_TICK_DEG;
    b.forwardVel += PADDLE_ACCEL * 0.3;
  }
  const max = b.onIce ? ICE_MAX : WATER_MAX;
  b.forwardVel = Math.max(-max, Math.min(max, b.forwardVel));
  const drag = b.onIce ? DRAG_ICE : DRAG_WATER;
  if (!b.leftPaddle && !b.rightPaddle) b.forwardVel *= drag;
  if (!b.onWater && !b.onIce) b.forwardVel *= 0.5; // out of water
}

export function currentMax(b: BoatState): number {
  return b.onIce ? ICE_MAX : WATER_MAX;
}
