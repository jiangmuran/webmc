// Arrow spread / accuracy. Fired arrows are perturbed by a small random
// angle; bow charging past full reduces spread; skeleton-fired arrows
// are more spread than player arrows.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ArrowAimQuery {
  direction: Vec3;
  chargeRatio: number; // 0..1 (full charge = 1)
  isFiredByPlayer: boolean;
  rng: () => number;
}

export interface AimedVelocity {
  velocity: Vec3;
}

const MAX_SPEED = 60; // terminal velocity cap

// Returns a perturbed velocity vector, speed scaled by chargeRatio.
export function aimArrow(q: ArrowAimQuery): AimedVelocity {
  const spreadBase = q.isFiredByPlayer ? 0.02 : 0.08;
  const spread = spreadBase * (1 - q.chargeRatio * 0.5);
  const dx = q.direction.x + (q.rng() - 0.5) * spread;
  const dy = q.direction.y + (q.rng() - 0.5) * spread;
  const dz = q.direction.z + (q.rng() - 0.5) * spread;
  const speed = Math.min(MAX_SPEED, q.chargeRatio * 60);
  return {
    velocity: { x: dx * speed, y: dy * speed, z: dz * speed },
  };
}

// Critical arrow: at charge 1.0 the arrow gets +0..+25% extra damage.
export function isCritical(chargeRatio: number): boolean {
  return chargeRatio >= 1;
}
