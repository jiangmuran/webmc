// Wiki (minecraft.wiki/w/Creeper): "When within 3 blocks of a player,
// a creeper … explodes after 1.5 seconds (30 ticks) … the distance
// that the player must move in order for a creeper to cancel its
// explosion is 7 blocks, regardless of difficulty."
//
// IGNITE_RANGE = 3 (start swell), CANCEL_RANGE = 7 (sustain swell
// up to here, abort beyond). Old code used IGNITE_RANGE × 2 = 6 for
// the abort threshold, 1 short of the wiki's 7. Sibling
// creeper_swell.ts already uses 7.

export interface CreeperAttack {
  distanceToTarget: number;
  fuseTicks: number;
  lineOfSight: boolean;
}

export const IGNITE_RANGE = 3;
export const CANCEL_RANGE = 7;
export const MAX_FUSE_TICKS = 30;

export function shouldIgnite(c: CreeperAttack): boolean {
  return c.lineOfSight && c.distanceToTarget <= IGNITE_RANGE;
}

export function shouldAbort(c: CreeperAttack): boolean {
  return !c.lineOfSight || c.distanceToTarget > CANCEL_RANGE;
}

export function readyToExplode(c: CreeperAttack): boolean {
  return c.fuseTicks >= MAX_FUSE_TICKS;
}
