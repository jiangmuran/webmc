// Wiki (minecraft.wiki/w/Farmland): "Any entity that falls onto
// farmland from a height of more than half a block (0.5 blocks)
// turns it back into dirt." The trample is DETERMINISTIC at any
// fall > 0.5 blocks; mass is NOT a wiki factor (a chicken trampling
// is the same as a horse trampling). Old probabilistic check
// (33%/66% based on mass) let half of all entity-landings pass
// through unscathed, so a player jumping in a wheat farm got the
// crops half the time instead of always-trampling like wiki canon.
//
// `entityMass` and `rand` parameters retained for back-compat with
// existing callers but ignored.

export interface FarmlandQuery {
  entityMass: number; // ignored; retained for back-compat
  fallDistance: number; // blocks
  rand: () => number; // ignored; retained for back-compat
}

export const TRAMPLE_MIN_FALL = 0.5;

export function willTrample(q: FarmlandQuery): boolean {
  void q.entityMass;
  void q.rand;
  return q.fallDistance > TRAMPLE_MIN_FALL;
}

// Hydration state: moisture 0..7 decays if no water within 4 blocks.
export const MOISTURE_MAX = 7;
export const WATER_RADIUS = 4;

export interface MoistureQuery {
  currentMoisture: number;
  waterWithinRadius: boolean;
  rand: () => number;
}

export function updateMoisture(q: MoistureQuery): number {
  if (q.waterWithinRadius) return MOISTURE_MAX;
  if (q.currentMoisture === 0) return 0;
  if (q.rand() < 0.25) return q.currentMoisture - 1;
  return q.currentMoisture;
}
