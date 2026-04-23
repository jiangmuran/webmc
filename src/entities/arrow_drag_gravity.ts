export interface ArrowState {
  vx: number;
  vy: number;
  vz: number;
  inWater: boolean;
}

export const GRAVITY = 0.05;
export const AIR_DRAG = 0.99;
export const WATER_DRAG = 0.6;

export function step(a: ArrowState): ArrowState {
  const drag = a.inWater ? WATER_DRAG : AIR_DRAG;
  return {
    vx: a.vx * drag,
    vy: a.vy * drag - GRAVITY,
    vz: a.vz * drag,
    inWater: a.inWater,
  };
}
