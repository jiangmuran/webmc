// Baby mob follow-parent behavior. Baby stays within N blocks of its
// parent; targets the nearest adult of same species when too far.

export const FOLLOW_RADIUS = 8;
export const STOP_FOLLOW_RADIUS = 2;

export interface Pos {
  x: number;
  y: number;
  z: number;
}

export interface FollowCtx {
  babyPos: Pos;
  parentPos: Pos | null;
  nearestAdultPos: Pos | null;
}

export type Target = Pos | null;

export function followTarget(c: FollowCtx): Target {
  const t = c.parentPos ?? c.nearestAdultPos;
  if (!t) return null;
  const d = dist(c.babyPos, t);
  if (d <= STOP_FOLLOW_RADIUS) return null;
  return t;
}

export function shouldUseNearestInstead(c: FollowCtx): boolean {
  if (!c.parentPos) return true;
  if (!c.nearestAdultPos) return false;
  return dist(c.babyPos, c.parentPos) > FOLLOW_RADIUS * 2;
}

function dist(a: Pos, b: Pos): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}
