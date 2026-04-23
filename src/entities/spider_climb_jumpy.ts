export interface SpiderState {
  adjacentToWall: boolean;
  onGround: boolean;
  hasJockey: boolean;
  sneakingTarget: boolean;
}

export function canClimb(s: SpiderState): boolean {
  return s.adjacentToWall;
}

export function jumpChance(s: SpiderState): number {
  if (!s.onGround) return 0;
  return s.hasJockey ? 0.01 : 0.05;
}

export function shouldAggro(light: number, isDaytime: boolean, sneakingTarget: boolean): boolean {
  if (sneakingTarget) return false;
  if (isDaytime && light >= 12) return false;
  return true;
}
