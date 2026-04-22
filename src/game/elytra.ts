// Elytra flight physics. When deployed, the player glides: pitch-down
// converts altitude to forward speed; pitch-up trades speed for lift;
// firework rockets (caller concern) add a burst of forward velocity.
// Pure kinematic — returns updated velocity after one tick.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ElytraTickInput {
  velocity: Vec3;
  pitchRad: number; // -π/2 (straight down) .. π/2 (straight up)
  yawRad: number;
  firework: boolean;
}

const GRAVITY = 6; // elytra gravity is softer than normal
const DRAG = 0.99;
const LIFT_FACTOR = 0.1;
const SPEED_CONVERT = 0.05;
const FIREWORK_BOOST = 1.5;

export function tickElytra(input: ElytraTickInput, dtSec: number): Vec3 {
  const { velocity, pitchRad } = input;
  const sinP = Math.sin(pitchRad);
  const cosP = Math.cos(pitchRad);
  const horizontalSpeed = Math.hypot(velocity.x, velocity.z);

  // Gravity + pitch lift.
  const nextY = velocity.y - GRAVITY * dtSec + horizontalSpeed * LIFT_FACTOR * cosP;

  // Convert vertical fall speed to horizontal speed when pitched down.
  const dive = Math.max(0, -sinP);
  const extraHorizontal = Math.max(0, -velocity.y) * dive * SPEED_CONVERT;
  const yawVec = {
    x: -Math.sin(input.yawRad) * cosP,
    z: -Math.cos(input.yawRad) * cosP,
  };

  let nextX = velocity.x + yawVec.x * extraHorizontal * dtSec;
  let nextZ = velocity.z + yawVec.z * extraHorizontal * dtSec;

  if (input.firework) {
    nextX += yawVec.x * FIREWORK_BOOST * dtSec * 20;
    nextZ += yawVec.z * FIREWORK_BOOST * dtSec * 20;
  }

  nextX *= DRAG;
  nextZ *= DRAG;

  return { x: nextX, y: nextY, z: nextZ };
}
