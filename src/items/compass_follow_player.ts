export interface CompassTargetCtx {
  x: number;
  z: number;
}

export interface PlayerPos {
  x: number;
  z: number;
  yawRad: number;
}

export function angleToTarget(p: PlayerPos, t: CompassTargetCtx): number {
  return Math.atan2(t.x - p.x, -(t.z - p.z)) - p.yawRad;
}

export function distance(p: PlayerPos, t: CompassTargetCtx): number {
  return Math.hypot(t.x - p.x, t.z - p.z);
}
