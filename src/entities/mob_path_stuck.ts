// Path-following stuck detection. If a mob hasn't moved 0.1 blocks
// over 40 ticks while a path is active, abort the path.

export interface PathFollower {
  lastPos: { x: number; y: number; z: number };
  lastMovedTick: number;
  pathActive: boolean;
}

export const STUCK_THRESHOLD_TICKS = 40;
export const MOVEMENT_EPSILON = 0.1;

export function makeFollower(startPos: { x: number; y: number; z: number }): PathFollower {
  return { lastPos: { ...startPos }, lastMovedTick: 0, pathActive: false };
}

export interface TickQuery {
  currentPos: { x: number; y: number; z: number };
  nowTick: number;
}

export function updateTracking(p: PathFollower, q: TickQuery): void {
  if (!p.pathActive) {
    p.lastPos = { ...q.currentPos };
    p.lastMovedTick = q.nowTick;
    return;
  }
  const dx = q.currentPos.x - p.lastPos.x;
  const dy = q.currentPos.y - p.lastPos.y;
  const dz = q.currentPos.z - p.lastPos.z;
  if (dx * dx + dy * dy + dz * dz >= MOVEMENT_EPSILON * MOVEMENT_EPSILON) {
    p.lastPos = { ...q.currentPos };
    p.lastMovedTick = q.nowTick;
  }
}

export function isStuck(p: PathFollower, nowTick: number): boolean {
  if (!p.pathActive) return false;
  return nowTick - p.lastMovedTick >= STUCK_THRESHOLD_TICKS;
}

export function startPath(p: PathFollower, nowTick: number): void {
  p.pathActive = true;
  p.lastMovedTick = nowTick;
}

export function endPath(p: PathFollower): void {
  p.pathActive = false;
}
