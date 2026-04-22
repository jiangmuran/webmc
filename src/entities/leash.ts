// Leash. Tether between a player / fence and a mob; breaks if stretched
// past 10 blocks.

export interface LeashAttachment {
  anchorId: number; // player or fence-knot id
  mobId: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const MAX_LEASH_LEN = 10;
const PULL_RADIUS = 6;
const PULL_STRENGTH = 0.4;

export interface LeashStep {
  snapped: boolean;
  pullVec: Vec3 | null;
}

export function tickLeash(anchor: Vec3, mob: Vec3): LeashStep {
  const dx = anchor.x - mob.x;
  const dy = anchor.y - mob.y;
  const dz = anchor.z - mob.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist >= MAX_LEASH_LEN) return { snapped: true, pullVec: null };
  if (dist <= PULL_RADIUS) return { snapped: false, pullVec: null };
  const over = dist - PULL_RADIUS;
  const factor = over * PULL_STRENGTH;
  const inv = dist > 0 ? 1 / dist : 0;
  return {
    snapped: false,
    pullVec: { x: dx * inv * factor, y: dy * inv * factor, z: dz * inv * factor },
  };
}
