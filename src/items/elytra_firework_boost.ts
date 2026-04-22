// Firework boost for elytra gliding. Using a firework rocket while
// gliding adds a forward impulse for ~0.5s per flight-duration. Stars
// on the rocket deal damage to the player (feature) and to nearby
// entities (already in firework_damage.ts).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface FireworkBoostQuery {
  lookForward: Vec3; // unit vector
  flightDuration: 1 | 2 | 3;
  currentVelocity: Vec3;
}

export interface FireworkBoostResult {
  velocityDelta: Vec3;
  boostDurationSec: number;
}

// MC formula: per tick the firework adds (look × 1.5 + current × 0.5) ÷ 10
// for the duration of the boost. This module returns the TOTAL delta
// applied over the boost; the engine can ease it over time.
export function fireworkBoost(q: FireworkBoostQuery): FireworkBoostResult {
  const duration = q.flightDuration * 0.5 + 0.5;
  // Impulse per second = 1.5 × look + 0.5 × current.
  const impulsePerSec = {
    x: 1.5 * q.lookForward.x + 0.5 * q.currentVelocity.x,
    y: 1.5 * q.lookForward.y + 0.5 * q.currentVelocity.y,
    z: 1.5 * q.lookForward.z + 0.5 * q.currentVelocity.z,
  };
  return {
    velocityDelta: {
      x: impulsePerSec.x * duration,
      y: impulsePerSec.y * duration,
      z: impulsePerSec.z * duration,
    },
    boostDurationSec: duration,
  };
}

// The firework is consumed on boost. If the rocket has firework stars,
// it self-damages the player at detonation (see firework_damage.ts).
export const BOOST_CONSUMES_ROCKET = true;

// Safety: do not allow boost while standing on ground.
export interface BoostEligibilityQuery {
  gliding: boolean;
  hasFireworkInHand: boolean;
}

export function canBoost(q: BoostEligibilityQuery): boolean {
  return q.gliding && q.hasFireworkInHand;
}
