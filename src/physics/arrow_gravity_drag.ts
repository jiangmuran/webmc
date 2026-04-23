export interface ArrowPhysicsInput {
  vx: number;
  vy: number;
  vz: number;
  inWater: boolean;
}

export const GRAVITY_PER_TICK = 0.05;
export const AIR_DRAG = 0.99;
export const WATER_DRAG = 0.6;

export function applyArrowTick(i: ArrowPhysicsInput): ArrowPhysicsInput {
  const drag = i.inWater ? WATER_DRAG : AIR_DRAG;
  return {
    vx: i.vx * drag,
    vy: (i.vy - GRAVITY_PER_TICK) * drag,
    vz: i.vz * drag,
    inWater: i.inWater,
  };
}

export function speed(i: ArrowPhysicsInput): number {
  return Math.hypot(i.vx, i.vy, i.vz);
}
