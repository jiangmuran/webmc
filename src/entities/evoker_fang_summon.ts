export interface FangSummonInput {
  casterX: number;
  casterZ: number;
  targetX: number;
  targetZ: number;
  patternLength: number;
}

export interface FangPos {
  x: number;
  z: number;
  delayTicks: number;
}

export function fangLine(i: FangSummonInput): readonly FangPos[] {
  const dx = i.targetX - i.casterX;
  const dz = i.targetZ - i.casterZ;
  const len = Math.hypot(dx, dz) || 1;
  const stepX = dx / len;
  const stepZ = dz / len;
  const fangs: FangPos[] = [];
  for (let k = 0; k < i.patternLength; k++) {
    fangs.push({
      x: i.casterX + stepX * k * 0.5,
      z: i.casterZ + stepZ * k * 0.5,
      delayTicks: k * 2,
    });
  }
  return fangs;
}

// Wiki (minecraft.wiki/w/Evoker#Fang_attack): "if the target is within
// three blocks of the evoker, the evoker summons the fangs in two
// circles around itself: the smaller circle has five fangs and the
// larger has eight."
//
// Old fangCircle was a single 12-fang ring at radius 2 — neither the
// 5-fang inner nor the 8-fang outer of wiki canon. Kept for back-
// compat with callers; new fangCirclesAround() returns the wiki pair.
export function fangCircle(i: FangSummonInput, count = 12): readonly FangPos[] {
  const fangs: FangPos[] = [];
  for (let k = 0; k < count; k++) {
    const angle = (k / count) * Math.PI * 2;
    fangs.push({
      x: i.casterX + Math.cos(angle) * 2,
      z: i.casterZ + Math.sin(angle) * 2,
      delayTicks: 0,
    });
  }
  return fangs;
}

export const FANG_INNER_RING_COUNT = 5;
export const FANG_OUTER_RING_COUNT = 8;
export const FANG_INNER_RADIUS = 1.5;
export const FANG_OUTER_RADIUS = 2.5;

export function fangCirclesAround(i: FangSummonInput): readonly FangPos[] {
  const out: FangPos[] = [];
  for (let k = 0; k < FANG_INNER_RING_COUNT; k++) {
    const angle = (k / FANG_INNER_RING_COUNT) * Math.PI * 2;
    out.push({
      x: i.casterX + Math.cos(angle) * FANG_INNER_RADIUS,
      z: i.casterZ + Math.sin(angle) * FANG_INNER_RADIUS,
      delayTicks: 0,
    });
  }
  for (let k = 0; k < FANG_OUTER_RING_COUNT; k++) {
    const angle = (k / FANG_OUTER_RING_COUNT) * Math.PI * 2;
    out.push({
      x: i.casterX + Math.cos(angle) * FANG_OUTER_RADIUS,
      z: i.casterZ + Math.sin(angle) * FANG_OUTER_RADIUS,
      delayTicks: 3,
    });
  }
  return out;
}
