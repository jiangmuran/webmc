// Llama spit. When attacked by a non-tamed enemy, llamas fire a
// projectile at the attacker. Deals 1 damage + minor knockback.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface LlamaSpit {
  position: Vec3;
  velocity: Vec3;
  ownerId: number;
  ageSec: number;
}

const LIFETIME_SEC = 10;

export function makeLlamaSpit(from: Vec3, dir: Vec3, ownerId: number): LlamaSpit {
  const speed = 6;
  return {
    position: { ...from },
    velocity: { x: dir.x * speed, y: dir.y * speed, z: dir.z * speed },
    ownerId,
    ageSec: 0,
  };
}

export interface SpitTickCtx {
  isSolid: (x: number, y: number, z: number) => boolean;
  dtSec: number;
}

export interface SpitTickResult {
  hitBlock: boolean;
  expired: boolean;
}

export function tickLlamaSpit(state: LlamaSpit, ctx: SpitTickCtx): SpitTickResult {
  state.ageSec += ctx.dtSec;
  state.velocity.y -= 15 * ctx.dtSec;
  state.position.x += state.velocity.x * ctx.dtSec;
  state.position.y += state.velocity.y * ctx.dtSec;
  state.position.z += state.velocity.z * ctx.dtSec;
  const hit = ctx.isSolid(
    Math.floor(state.position.x),
    Math.floor(state.position.y),
    Math.floor(state.position.z),
  );
  return { hitBlock: hit, expired: state.ageSec >= LIFETIME_SEC };
}

export const LLAMA_SPIT_DAMAGE = 1;
