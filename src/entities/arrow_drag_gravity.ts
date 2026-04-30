export interface ArrowState {
  vx: number;
  vy: number;
  vz: number;
  inWater: boolean;
}

export const GRAVITY = 0.05;
export const AIR_DRAG = 0.99;
export const WATER_DRAG = 0.6;

// Wiki (minecraft.wiki/w/Arrow): per tick, "Its velocity vector is
// multiplied by 0.99 if it's in air or 0.6 if it's in water (this
// is the 'drag'). 0.05 is subtracted from its velocity vector's y
// component (this is the 'gravity')." Drag is applied FIRST, then
// gravity is subtracted. The math formula on the wiki confirms it:
//   V_t = 0.99^t · (V_0 + [0,5,0]) − [0,5,0]
// expanding for t=1 gives V_1.y = 0.99·V_0.y − 0.05.
// Sibling arrow_trajectory.ts already does drag → gravity in this
// order. Old formula `(vy - GRAVITY) * drag` applied gravity first
// then drag, giving an initial drop of −0.0495 instead of the
// canonical −0.05.
export function step(a: ArrowState): ArrowState {
  const drag = a.inWater ? WATER_DRAG : AIR_DRAG;
  return {
    vx: a.vx * drag,
    vy: a.vy * drag - GRAVITY,
    vz: a.vz * drag,
    inWater: a.inWater,
  };
}
