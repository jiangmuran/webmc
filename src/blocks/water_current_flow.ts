// Water current push. Flowing water applies a small horizontal
// velocity to entities in the block. Direction is toward the highest
// adjacent water level (downhill).

export interface WaterCell {
  level: number; // 0..7 (higher = shallower / source at 7)
}

export interface FlowQuery {
  here: WaterCell;
  north: WaterCell | null;
  south: WaterCell | null;
  east: WaterCell | null;
  west: WaterCell | null;
}

export const PUSH_STRENGTH = 0.014;

export interface FlowVector {
  vx: number;
  vz: number;
}

export function currentVelocity(q: FlowQuery): FlowVector {
  let vx = 0;
  let vz = 0;
  if (q.north && q.north.level > q.here.level) vz -= PUSH_STRENGTH;
  if (q.south && q.south.level > q.here.level) vz += PUSH_STRENGTH;
  if (q.east && q.east.level > q.here.level) vx += PUSH_STRENGTH;
  if (q.west && q.west.level > q.here.level) vx -= PUSH_STRENGTH;
  return { vx, vz };
}

export function isStillWater(q: FlowQuery): boolean {
  const v = currentVelocity(q);
  return v.vx === 0 && v.vz === 0;
}
