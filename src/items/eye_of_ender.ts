// Eye of ender — thrown toward the nearest stronghold; once close enough
// pops into an air position + drops back to the player with 20% chance
// of shattering.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface EyeOfEnderState {
  position: Vec3;
  targetStronghold: Vec3 | null;
  velocity: Vec3;
  lifetimeSec: number;
}

const MAX_LIFETIME_SEC = 4;
const FLIGHT_SPEED = 8;

export function throwEye(from: Vec3, target: Vec3 | null): EyeOfEnderState {
  let velocity: Vec3 = { x: 0, y: 0, z: 0 };
  if (target) {
    const dx = target.x - from.x;
    const dz = target.z - from.z;
    const d = Math.hypot(dx, dz) || 1;
    velocity = { x: (dx / d) * FLIGHT_SPEED, y: 1.5, z: (dz / d) * FLIGHT_SPEED };
  } else {
    velocity = { x: 0, y: 1.5, z: 0 };
  }
  return { position: { ...from }, targetStronghold: target, velocity, lifetimeSec: 0 };
}

export interface EyeTickResult {
  popped: boolean; // eye reached apex — show particle trail
  shattered: boolean; // true = consumed, else drops as pickable item
}

export function tickEye(
  state: EyeOfEnderState,
  dtSec: number,
  rng: () => number = Math.random,
): EyeTickResult {
  state.position.x += state.velocity.x * dtSec;
  state.position.y += state.velocity.y * dtSec;
  state.position.z += state.velocity.z * dtSec;
  // Float at apex after 1s.
  if (state.lifetimeSec < 1) state.velocity.y *= 0.85;
  state.lifetimeSec += dtSec;
  if (state.lifetimeSec >= MAX_LIFETIME_SEC) {
    return { popped: true, shattered: rng() < 0.2 };
  }
  return { popped: false, shattered: false };
}
