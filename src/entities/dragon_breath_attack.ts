// Ender Dragon breath attack. During the perch phase (or at random
// during fly-bys), the dragon breathes a cone of purple acid-fog that
// lingers for a few seconds as a "lingering cloud" dealing Harming II.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface BreathCone {
  apex: Vec3;
  direction: Vec3; // unit vector
  halfAngleRad: number; // cone half-angle
  lengthBlocks: number;
  expiresAtSec: number;
}

export function makeBreathCone(apex: Vec3, direction: Vec3, nowSec: number): BreathCone {
  const mag = Math.hypot(direction.x, direction.y, direction.z) || 1;
  return {
    apex: { ...apex },
    direction: {
      x: direction.x / mag,
      y: direction.y / mag,
      z: direction.z / mag,
    },
    halfAngleRad: (Math.PI / 180) * 15, // 30° cone
    lengthBlocks: 30,
    expiresAtSec: nowSec + 4,
  };
}

// Is a target inside the breath cone?
export function inCone(cone: BreathCone, point: Vec3): boolean {
  const dx = point.x - cone.apex.x;
  const dy = point.y - cone.apex.y;
  const dz = point.z - cone.apex.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist > cone.lengthBlocks) return false;
  if (dist < 0.01) return false;
  const dot = (dx * cone.direction.x + dy * cone.direction.y + dz * cone.direction.z) / dist;
  return dot >= Math.cos(cone.halfAngleRad);
}

// Lingering cloud: after the breath is over, the "puddle" remains at
// landing location for 30 seconds, dealing Harming II on contact.
export interface LingeringCloud {
  pos: Vec3;
  radius: number;
  expiresAtSec: number;
  effect: string;
  effectAmplifier: number;
}

export function makeDragonBreathCloud(pos: Vec3, nowSec: number): LingeringCloud {
  return {
    pos: { ...pos },
    radius: 3,
    expiresAtSec: nowSec + 30,
    effect: 'instant_damage',
    effectAmplifier: 1,
  };
}

export function cloudActive(c: LingeringCloud, nowSec: number): boolean {
  return nowSec < c.expiresAtSec;
}

export function cloudAffects(c: LingeringCloud, point: Vec3): boolean {
  const dx = point.x - c.pos.x;
  const dy = point.y - c.pos.y;
  const dz = point.z - c.pos.z;
  return Math.hypot(dx, dy, dz) <= c.radius;
}
