export interface ArrowPhysicsInput {
  vx: number;
  vy: number;
  vz: number;
  inWater: boolean;
}

export const GRAVITY_PER_TICK = 0.05;
export const AIR_DRAG = 0.99;
export const WATER_DRAG = 0.6;

// Wiki (minecraft.wiki/w/Arrow): drag (0.99 air / 0.6 water) is
// applied to velocity FIRST, then 0.05 is subtracted from y as
// gravity. The wiki's closed-form V_t = 0.99^t·(V_0+[0,5,0])−[0,5,0]
// confirms drag → gravity ordering: V_1.y = 0.99·V_0.y − 0.05.
// Old formula `(vy - GRAVITY) * drag` applied gravity first and
// gave initial drop −0.0495 instead of the canonical −0.05.
export function applyArrowTick(i: ArrowPhysicsInput): ArrowPhysicsInput {
  const drag = i.inWater ? WATER_DRAG : AIR_DRAG;
  return {
    vx: i.vx * drag,
    vy: i.vy * drag - GRAVITY_PER_TICK,
    vz: i.vz * drag,
    inWater: i.inWater,
  };
}

export function speed(i: ArrowPhysicsInput): number {
  return Math.hypot(i.vx, i.vy, i.vz);
}
