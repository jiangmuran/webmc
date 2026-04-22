// Minecart kinematics. Rails exist in 6 configurations (flat NS/EW, ascending
// N/S/E/W, curved). A minecart at rest on a rail accelerates under powered-
// rail push; maintains velocity along the rail axis; switches direction
// smoothly at curves. Pure given a rail lookup + a base accel.

export type RailKind =
  | 'flat_ns'
  | 'flat_ew'
  | 'ascending_n'
  | 'ascending_s'
  | 'ascending_e'
  | 'ascending_w'
  | 'curve_ne'
  | 'curve_nw'
  | 'curve_se'
  | 'curve_sw';

export interface RailLookup {
  railAt(x: number, y: number, z: number): RailKind | null;
  isPowered(x: number, y: number, z: number): boolean;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Minecart {
  id: number;
  position: Vec3;
  velocity: Vec3;
}

const MAX_SPEED = 8; // blocks/sec
const DRAG_PER_SEC = 0.4;
const POWERED_ACCEL = 8;

// Map rail kind → dominant axis unit vector. Curves get the axis averaged
// based on current velocity direction.
function railAxis(kind: RailKind, vx: number, vz: number): { x: number; y: number; z: number } {
  switch (kind) {
    case 'flat_ns':
      return { x: 0, y: 0, z: vz >= 0 ? 1 : -1 };
    case 'flat_ew':
      return { x: vx >= 0 ? 1 : -1, y: 0, z: 0 };
    case 'ascending_n':
      return { x: 0, y: 0.5, z: -1 };
    case 'ascending_s':
      return { x: 0, y: 0.5, z: 1 };
    case 'ascending_e':
      return { x: 1, y: 0.5, z: 0 };
    case 'ascending_w':
      return { x: -1, y: 0.5, z: 0 };
    case 'curve_ne':
      return { x: 0.707, y: 0, z: -0.707 };
    case 'curve_nw':
      return { x: -0.707, y: 0, z: -0.707 };
    case 'curve_se':
      return { x: 0.707, y: 0, z: 0.707 };
    case 'curve_sw':
      return { x: -0.707, y: 0, z: 0.707 };
  }
}

export function tickMinecart(cart: Minecart, dtSec: number, rails: RailLookup): void {
  const cellX = Math.floor(cart.position.x);
  const cellY = Math.floor(cart.position.y);
  const cellZ = Math.floor(cart.position.z);
  const kind = rails.railAt(cellX, cellY, cellZ);
  if (!kind) {
    // Off-rail: gravity + friction.
    cart.velocity.y -= 20 * dtSec;
    cart.velocity.x *= 0.9;
    cart.velocity.z *= 0.9;
    cart.position.x += cart.velocity.x * dtSec;
    cart.position.y += cart.velocity.y * dtSec;
    cart.position.z += cart.velocity.z * dtSec;
    return;
  }
  const axis = railAxis(kind, cart.velocity.x, cart.velocity.z);
  // Snap horizontal velocity to rail axis (preserves magnitude).
  const hSpeed = Math.hypot(cart.velocity.x, cart.velocity.z);
  cart.velocity.x = axis.x * hSpeed;
  cart.velocity.z = axis.z * hSpeed;
  cart.velocity.y = axis.y * hSpeed;

  if (rails.isPowered(cellX, cellY, cellZ)) {
    cart.velocity.x += axis.x * POWERED_ACCEL * dtSec;
    cart.velocity.z += axis.z * POWERED_ACCEL * dtSec;
  } else {
    // Drag.
    const factor = Math.max(0, 1 - DRAG_PER_SEC * dtSec);
    cart.velocity.x *= factor;
    cart.velocity.z *= factor;
  }
  // Clamp to max speed.
  const speed = Math.hypot(cart.velocity.x, cart.velocity.z);
  if (speed > MAX_SPEED) {
    const s = MAX_SPEED / speed;
    cart.velocity.x *= s;
    cart.velocity.z *= s;
  }
  cart.position.x += cart.velocity.x * dtSec;
  cart.position.y += cart.velocity.y * dtSec;
  cart.position.z += cart.velocity.z * dtSec;
}
