export interface BoatControl {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
}

export const MAX_TURN_RATE_RADS_PER_TICK = 0.1;

export function yawDelta(c: BoatControl): number {
  const turn = (c.left ? -1 : 0) + (c.right ? 1 : 0);
  const motionBoost = c.forward ? 1.2 : c.back ? 0.7 : 1;
  return turn * MAX_TURN_RATE_RADS_PER_TICK * motionBoost;
}

export function paddlingActive(c: BoatControl): boolean {
  return c.forward || c.back || c.left || c.right;
}

export function dampenYaw(currentYaw: number, targetYaw: number, smoothingFactor = 0.2): number {
  return currentYaw + (targetYaw - currentYaw) * smoothingFactor;
}
