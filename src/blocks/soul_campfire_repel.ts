// Soul campfire. Repels piglins within 8 blocks. Deals 2 damage/tick
// if stood on (vs 1 for normal campfire). Smoke is blue, higher.

export interface CampfireQuery {
  variant: 'campfire' | 'soul_campfire';
  playerStandsOn: boolean;
  piglinWithinRadius: boolean;
  piglinDistance: number;
}

export const PIGLIN_REPEL_RADIUS = 8;

export function repelsPiglin(q: CampfireQuery): boolean {
  if (q.variant !== 'soul_campfire') return false;
  if (!q.piglinWithinRadius) return false;
  return q.piglinDistance <= PIGLIN_REPEL_RADIUS;
}

export const CAMPFIRE_DAMAGE = 1;
export const SOUL_CAMPFIRE_DAMAGE = 2;

export function damagePerTick(q: CampfireQuery): number {
  if (!q.playerStandsOn) return 0;
  return q.variant === 'soul_campfire' ? SOUL_CAMPFIRE_DAMAGE : CAMPFIRE_DAMAGE;
}

// Smoke signal: hay block underneath raises smoke column to y=~10.
export function smokeHeight(hayBelow: boolean): number {
  return hayBelow ? 24 : 10;
}

// Smoke color: soul campfire = cyan-ish; regular = white.
export function smokeColor(variant: CampfireQuery['variant']): string {
  return variant === 'soul_campfire' ? '#80c8ff' : '#ffffff';
}
