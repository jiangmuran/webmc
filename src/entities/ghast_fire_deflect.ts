// Ghast fireball deflection. Hitting a ghast fireball with a bare fist,
// sword, or shield reverses its velocity. With a crit (e.g. aimed hit),
// the damage is multiplied and the fireball returns straight at the
// ghast.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface DeflectQuery {
  fireballVelocity: Vec3;
  hitMethod: 'punch' | 'sword' | 'shield' | 'crossbow';
  critical: boolean;
  ghastPos: Vec3 | null; // if known, deflection aims back at ghast
  hitPos: Vec3;
}

export interface DeflectResult {
  newVelocity: Vec3;
  deflected: boolean;
}

export function deflectFireball(q: DeflectQuery): DeflectResult {
  if (q.hitMethod === 'crossbow') {
    // crossbow bolts don't deflect — they destroy the fireball.
    return {
      newVelocity: { x: 0, y: 0, z: 0 },
      deflected: false,
    };
  }
  if (q.critical && q.ghastPos) {
    const dx = q.ghastPos.x - q.hitPos.x;
    const dy = q.ghastPos.y - q.hitPos.y;
    const dz = q.ghastPos.z - q.hitPos.z;
    const mag = Math.hypot(dx, dy, dz) || 1;
    const speed = Math.hypot(q.fireballVelocity.x, q.fireballVelocity.y, q.fireballVelocity.z);
    return {
      deflected: true,
      newVelocity: {
        x: (dx / mag) * speed,
        y: (dy / mag) * speed,
        z: (dz / mag) * speed,
      },
    };
  }
  return {
    deflected: true,
    newVelocity: {
      x: -q.fireballVelocity.x,
      y: -q.fireballVelocity.y,
      z: -q.fireballVelocity.z,
    },
  };
}

// Fireball radius and damage (ghast fireball explosion power 1).
export const FIREBALL_EXPLOSION_POWER = 1;
export const FIREBALL_DIRECT_DAMAGE = 6;
