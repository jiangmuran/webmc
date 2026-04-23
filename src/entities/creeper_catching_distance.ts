export interface CreeperAttack {
  distanceToTarget: number;
  fuseTicks: number;
  lineOfSight: boolean;
}

export const IGNITE_RANGE = 3;
export const MAX_FUSE_TICKS = 30;

export function shouldIgnite(c: CreeperAttack): boolean {
  return c.lineOfSight && c.distanceToTarget <= IGNITE_RANGE;
}

export function shouldAbort(c: CreeperAttack): boolean {
  return !c.lineOfSight || c.distanceToTarget > IGNITE_RANGE * 2;
}

export function readyToExplode(c: CreeperAttack): boolean {
  return c.fuseTicks >= MAX_FUSE_TICKS;
}
