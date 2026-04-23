export interface PlayerNearDolphin {
  ticksSinceLastDolphinTouch: number;
}

export const GRACE_DURATION = 100;
export const SWIM_SPEED_MULT = 1.3;

export function hasGrace(p: PlayerNearDolphin): boolean {
  return p.ticksSinceLastDolphinTouch < GRACE_DURATION;
}

export function swimMultiplier(p: PlayerNearDolphin): number {
  return hasGrace(p) ? SWIM_SPEED_MULT : 1;
}
