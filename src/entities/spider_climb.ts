// Spider climbing. Spiders can climb vertical walls if they're pressed
// against a solid face and attempting to move forward. Climb is modeled
// as zeroed gravity + constant upward velocity while the "climbing"
// flag is set.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SpiderState {
  position: Vec3;
  velocity: Vec3;
  climbing: boolean;
  walkIntent: Vec3; // desired horizontal direction (unit-ish)
}

export interface SpiderClimbCtx {
  hasSolidWallInFront: boolean;
  inputForward: number;
}

const CLIMB_SPEED_Y = 0.15;

export function updateClimbing(state: SpiderState, ctx: SpiderClimbCtx): void {
  state.climbing = ctx.hasSolidWallInFront && ctx.inputForward > 0;
}

export function applyClimbVelocity(state: SpiderState): void {
  if (state.climbing) state.velocity.y = CLIMB_SPEED_Y;
}

// Spiders can also hold onto walls by pausing downward fall; useful for
// the "spider jockey" mount where the rider wants to rest on a wall.
export function slowFallOnWall(state: SpiderState, vy: number): number {
  if (state.climbing && vy < 0) return 0;
  return vy;
}

// Cave spider variant is smaller and faster; exposes a scalar for
// external tests.
export type SpiderVariant = 'spider' | 'cave_spider';

export function spiderSizeMultiplier(variant: SpiderVariant): number {
  return variant === 'cave_spider' ? 0.7 : 1.0;
}

export function spiderSpeedMultiplier(variant: SpiderVariant): number {
  return variant === 'cave_spider' ? 1.2 : 1.0;
}
