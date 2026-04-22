// Leash knot. A lead entity can be tied to a fence (fence + wall both
// count) — a "leash knot" entity appears at that fence and the mob
// stays within 10 blocks. Killing the leash knot or breaking the fence
// releases all tied mobs.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface LeashKnot {
  id: number;
  fencePos: Vec3;
  tiedMobIds: Set<number>;
}

export function makeLeashKnot(id: number, fencePos: Vec3): LeashKnot {
  return { id, fencePos: { ...fencePos }, tiedMobIds: new Set() };
}

export const LEASH_MAX_DISTANCE = 10;
export const LEASH_SNAP_DISTANCE = 12;

export interface TieQuery {
  knot: LeashKnot;
  mobId: number;
  mobPos: Vec3;
}

export interface TieResult {
  tied: boolean;
  reason?: 'already_tied' | 'too_far';
}

export function tieMob(q: TieQuery): TieResult {
  if (q.knot.tiedMobIds.has(q.mobId)) {
    return { tied: false, reason: 'already_tied' };
  }
  const dx = q.mobPos.x - q.knot.fencePos.x;
  const dy = q.mobPos.y - q.knot.fencePos.y;
  const dz = q.mobPos.z - q.knot.fencePos.z;
  if (Math.hypot(dx, dy, dz) > LEASH_MAX_DISTANCE) {
    return { tied: false, reason: 'too_far' };
  }
  q.knot.tiedMobIds.add(q.mobId);
  return { tied: true };
}

export function untieMob(knot: LeashKnot, mobId: number): boolean {
  return knot.tiedMobIds.delete(mobId);
}

// On mob movement, apply a pull force toward the knot if the mob is
// near the leash range; snap the leash if it stretches past limit.
export interface LeashPullQuery {
  knot: LeashKnot;
  mobId: number;
  mobPos: Vec3;
}

export interface LeashPullResult {
  pullForce: Vec3;
  shouldSnap: boolean;
}

export function computePull(q: LeashPullQuery): LeashPullResult {
  if (!q.knot.tiedMobIds.has(q.mobId)) {
    return { pullForce: { x: 0, y: 0, z: 0 }, shouldSnap: false };
  }
  const dx = q.knot.fencePos.x - q.mobPos.x;
  const dy = q.knot.fencePos.y - q.mobPos.y;
  const dz = q.knot.fencePos.z - q.mobPos.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist >= LEASH_SNAP_DISTANCE) {
    return { pullForce: { x: 0, y: 0, z: 0 }, shouldSnap: true };
  }
  if (dist <= LEASH_MAX_DISTANCE) {
    return { pullForce: { x: 0, y: 0, z: 0 }, shouldSnap: false };
  }
  const over = dist - LEASH_MAX_DISTANCE;
  const mag = over * 0.5;
  return {
    pullForce: { x: (dx / dist) * mag, y: (dy / dist) * mag, z: (dz / dist) * mag },
    shouldSnap: false,
  };
}

export function destroyKnot(knot: LeashKnot): readonly number[] {
  const freed = Array.from(knot.tiedMobIds);
  knot.tiedMobIds.clear();
  return freed;
}
