// Ghast fireball. Large explosive projectile; on impact creates a power-1
// explosion + fire. Can be batted back with any attack (reverses velocity).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Fireball {
  position: Vec3;
  velocity: Vec3;
  ownerId: number | null;
  ageSec: number;
}

const LIFETIME_SEC = 45;
const EXPLOSION_POWER = 1;

export function makeFireball(
  from: Vec3,
  direction: Vec3,
  speed: number,
  ownerId: number | null = null,
): Fireball {
  return {
    position: { ...from },
    velocity: {
      x: direction.x * speed,
      y: direction.y * speed,
      z: direction.z * speed,
    },
    ownerId,
    ageSec: 0,
  };
}

export interface FireballTickCtx {
  isSolid: (x: number, y: number, z: number) => boolean;
}

export interface FireballResult {
  explosionPower: number;
  igniteFire: boolean;
  expired: boolean;
}

export function tickFireball(state: Fireball, dtSec: number, ctx: FireballTickCtx): FireballResult {
  state.ageSec += dtSec;
  state.position.x += state.velocity.x * dtSec;
  state.position.y += state.velocity.y * dtSec;
  state.position.z += state.velocity.z * dtSec;
  // Fireballs have no gravity; very slight drag.
  state.velocity.x *= 0.995;
  state.velocity.y *= 0.995;
  state.velocity.z *= 0.995;
  const hitBlock = ctx.isSolid(
    Math.floor(state.position.x),
    Math.floor(state.position.y),
    Math.floor(state.position.z),
  );
  const expired = state.ageSec >= LIFETIME_SEC;
  if (hitBlock || expired) {
    return { explosionPower: EXPLOSION_POWER, igniteFire: true, expired };
  }
  return { explosionPower: 0, igniteFire: false, expired: false };
}

// Batting the fireball reverses velocity + sets the attacker as owner
// (so deflected fireballs kill the ghast that fired them).
export function batFireball(state: Fireball, attackDirection: Vec3, attackerId: number): void {
  const speed = Math.hypot(state.velocity.x, state.velocity.y, state.velocity.z) || 1;
  state.velocity.x = attackDirection.x * speed;
  state.velocity.y = attackDirection.y * speed;
  state.velocity.z = attackDirection.z * speed;
  state.ownerId = attackerId;
}
