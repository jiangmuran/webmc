// Bed explosions. Sleeping in the Nether or End detonates the bed with
// an explosion of power 5 (similar to creeper). Respawn anchors behave
// similarly in the Overworld/End but not the Nether (their only safe
// dimension), with power 5 per charge.

export type Dimension = 'overworld' | 'nether' | 'end' | 'custom';

export interface BedUseQuery {
  dimension: Dimension;
  isNight: boolean;
}

export interface BedUseResult {
  canSleep: boolean;
  explodes: boolean;
  explosionPower: number;
}

export function tryUseBed(q: BedUseQuery): BedUseResult {
  if (q.dimension === 'nether' || q.dimension === 'end') {
    return { canSleep: false, explodes: true, explosionPower: 5 };
  }
  if (!q.isNight) return { canSleep: false, explodes: false, explosionPower: 0 };
  return { canSleep: true, explodes: false, explosionPower: 0 };
}

export interface AnchorUseQuery {
  dimension: Dimension;
  charges: number; // 0..4
}

export interface AnchorUseResult {
  canRespawn: boolean;
  explodes: boolean;
  explosionPower: number;
  chargesAfter: number;
}

// Using a respawn anchor:
//   - In the nether (its "home" dim), sets spawn + consumes 1 charge.
//   - In overworld/end, explodes with power 5.
export function tryUseAnchor(q: AnchorUseQuery): AnchorUseResult {
  if (q.dimension === 'nether') {
    if (q.charges <= 0) {
      return { canRespawn: false, explodes: false, explosionPower: 0, chargesAfter: 0 };
    }
    return {
      canRespawn: true,
      explodes: false,
      explosionPower: 0,
      chargesAfter: q.charges - 1,
    };
  }
  return {
    canRespawn: false,
    explodes: true,
    explosionPower: 5,
    chargesAfter: q.charges,
  };
}
