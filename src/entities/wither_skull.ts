// Wither skull projectile. Fired by the wither boss; flies in a straight
// line, deals 6 HP on hit, applies 10s wither effect, and explodes with
// power-1 on contact.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface WitherSkull {
  position: Vec3;
  velocity: Vec3;
  charged: boolean; // "blue" skulls from low-HP wither = more damage + block-break
  ageSec: number;
}

const LIFETIME_SEC = 30;
const NORMAL_POWER = 1;
const CHARGED_POWER = 2;
const DRAG = 0.98;

export function makeWitherSkull(
  position: Vec3,
  direction: Vec3,
  speed: number,
  charged: boolean,
): WitherSkull {
  return {
    position: { ...position },
    velocity: {
      x: direction.x * speed,
      y: direction.y * speed,
      z: direction.z * speed,
    },
    charged,
    ageSec: 0,
  };
}

export interface WitherSkullTickContext {
  isSolid: (x: number, y: number, z: number) => boolean;
}

export interface WitherSkullResult {
  hitBlock: boolean;
  expired: boolean;
  explosionPower: number;
}

export function tickWitherSkull(
  state: WitherSkull,
  dtSec: number,
  ctx: WitherSkullTickContext,
): WitherSkullResult {
  state.ageSec += dtSec;
  state.position.x += state.velocity.x * dtSec;
  state.position.y += state.velocity.y * dtSec;
  state.position.z += state.velocity.z * dtSec;
  state.velocity.x *= DRAG;
  state.velocity.y *= DRAG;
  state.velocity.z *= DRAG;

  const expired = state.ageSec >= LIFETIME_SEC;
  const hitBlock = ctx.isSolid(
    Math.floor(state.position.x),
    Math.floor(state.position.y),
    Math.floor(state.position.z),
  );
  return {
    hitBlock,
    expired,
    explosionPower: hitBlock || expired ? (state.charged ? CHARGED_POWER : NORMAL_POWER) : 0,
  };
}

export const WITHER_SKULL_DAMAGE = 6;
export const WITHER_EFFECT_DURATION_SEC = 10;
