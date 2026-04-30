export interface ArrowState {
  vx: number;
  vy: number;
  vz: number;
  inWater: boolean;
}

export const GRAVITY = 0.05;
export const AIR_DRAG = 0.99;
export const WATER_DRAG = 0.6;

// Wiki (minecraft.wiki/w/Arrow): "Per tick the arrow updates as
// vy = (vy - 0.05) * drag (drag = 0.99 in air, 0.6 in water), with
// vx/vz multiplied by drag." Old formula `vy * drag - GRAVITY`
// applied drag BEFORE gravity, giving slightly different trajectories
// (initial drop -0.05 instead of -0.0495 etc.). Sibling
// src/physics/arrow_gravity_drag.ts already uses the wiki order.
export function step(a: ArrowState): ArrowState {
  const drag = a.inWater ? WATER_DRAG : AIR_DRAG;
  return {
    vx: a.vx * drag,
    vy: (a.vy - GRAVITY) * drag,
    vz: a.vz * drag,
    inWater: a.inWater,
  };
}
