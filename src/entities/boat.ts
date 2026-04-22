// Boat physics. A boat floats in water, accelerates under rider input,
// slows to zero without input, sinks slowly on land. Pure kinematic —
// caller provides isWater at the boat's base cell.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Boat {
  id: number;
  position: Vec3;
  velocity: Vec3;
  yaw: number;
  hasRider: boolean;
}

export interface BoatLookup {
  isWater(x: number, y: number, z: number): boolean;
  isSolid(x: number, y: number, z: number): boolean;
}

export interface BoatInput {
  forward: number; // -1..1
  turn: number; // -1..1
}

const MAX_SPEED = 5;
const ACCEL = 6;
const TURN_RATE = 1.5;
const WATER_DRAG_PER_SEC = 0.6;
const LAND_DRAG_PER_SEC = 3;
const GRAVITY = 16;
const BUOYANCY = 20;

export function tickBoat(boat: Boat, dtSec: number, input: BoatInput, lookup: BoatLookup): void {
  const cellX = Math.floor(boat.position.x);
  const cellY = Math.floor(boat.position.y);
  const cellZ = Math.floor(boat.position.z);
  const inWater = lookup.isWater(cellX, cellY, cellZ);

  if (inWater) {
    // Buoy up until floating; apply gentle drag.
    boat.velocity.y += (BUOYANCY - GRAVITY) * dtSec;
    boat.velocity.y = Math.max(-0.5, Math.min(0.5, boat.velocity.y));
  } else {
    boat.velocity.y -= GRAVITY * dtSec;
  }

  if (boat.hasRider) {
    boat.yaw += input.turn * TURN_RATE * dtSec;
    const sinY = Math.sin(boat.yaw);
    const cosY = Math.cos(boat.yaw);
    boat.velocity.x += -sinY * input.forward * ACCEL * dtSec;
    boat.velocity.z += -cosY * input.forward * ACCEL * dtSec;
  }

  // Drag.
  const drag = inWater ? WATER_DRAG_PER_SEC : LAND_DRAG_PER_SEC;
  const dragFactor = Math.max(0, 1 - drag * dtSec);
  boat.velocity.x *= dragFactor;
  boat.velocity.z *= dragFactor;

  // Clamp horizontal speed.
  const hSpeed = Math.hypot(boat.velocity.x, boat.velocity.z);
  if (hSpeed > MAX_SPEED) {
    const f = MAX_SPEED / hSpeed;
    boat.velocity.x *= f;
    boat.velocity.z *= f;
  }

  boat.position.x += boat.velocity.x * dtSec;
  boat.position.y += boat.velocity.y * dtSec;
  boat.position.z += boat.velocity.z * dtSec;
}
