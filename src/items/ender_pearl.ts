// Ender pearl. Thrown projectile that teleports the thrower to the
// impact location, dealing 5 HP (regardless of armor). 1s cooldown.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface EnderPearl {
  position: Vec3;
  velocity: Vec3;
  throwerId: number;
  ageSec: number;
}

const LIFETIME_SEC = 30;

export function makeEnderPearl(from: Vec3, dir: Vec3, throwerId: number): EnderPearl {
  const speed = 10;
  return {
    position: { ...from },
    velocity: { x: dir.x * speed, y: dir.y * speed + 0.4, z: dir.z * speed },
    throwerId,
    ageSec: 0,
  };
}

export interface PearlTickCtx {
  isSolid: (x: number, y: number, z: number) => boolean;
  dtSec: number;
}

export interface PearlResult {
  impacted: boolean;
  expired: boolean;
  teleportTo: Vec3 | null;
}

export function tickEnderPearl(state: EnderPearl, ctx: PearlTickCtx): PearlResult {
  state.ageSec += ctx.dtSec;
  state.velocity.y -= 12 * ctx.dtSec;
  state.position.x += state.velocity.x * ctx.dtSec;
  state.position.y += state.velocity.y * ctx.dtSec;
  state.position.z += state.velocity.z * ctx.dtSec;
  const b = {
    x: Math.floor(state.position.x),
    y: Math.floor(state.position.y),
    z: Math.floor(state.position.z),
  };
  if (ctx.isSolid(b.x, b.y, b.z)) {
    return { impacted: true, expired: false, teleportTo: state.position };
  }
  return { impacted: false, expired: state.ageSec >= LIFETIME_SEC, teleportTo: null };
}

export const ENDER_PEARL_SELF_DAMAGE = 5;
export const ENDER_PEARL_COOLDOWN_SEC = 1;
