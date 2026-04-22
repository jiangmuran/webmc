// Scaffolding. Placed horizontally to extend sideways (up to 6 blocks
// before requiring vertical support). Climbable like ladder but with
// vertical descent by crouching.

export interface ScaffoldPlace {
  hasSolidBelow: boolean;
  adjacentScaffoldDistance: number; // distance in blocks to nearest vertical support
}

export const MAX_HORIZONTAL_SPAN = 6;

export function canPlace(q: ScaffoldPlace): boolean {
  if (q.hasSolidBelow) return true;
  return q.adjacentScaffoldDistance <= MAX_HORIZONTAL_SPAN;
}

// Climbing: velocity model.
export interface ClimbQuery {
  crouching: boolean;
  jumping: boolean;
  standingOnScaffold: boolean;
}

export const CLIMB_UP_SPEED = 0.15;
export const CLIMB_DOWN_SPEED = -0.15;

export function verticalVelocity(q: ClimbQuery): number {
  if (!q.standingOnScaffold) return 0;
  if (q.jumping) return CLIMB_UP_SPEED;
  if (q.crouching) return CLIMB_DOWN_SPEED;
  return 0;
}

// Break-from-bottom: breaking the scaffolding at y breaks all scaffolding
// directly above it up to the first non-scaffolding block.
export function cascadeBreakCount(aboveHeight: number): number {
  return Math.max(0, aboveHeight);
}
