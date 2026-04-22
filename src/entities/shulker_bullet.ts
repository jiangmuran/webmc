// Shulker bullet. Homing projectile fired by shulkers. Travels in
// right-angle turns toward target, dealing 4 HP + Levitation X for 10s on
// hit. Destructible — any hit neutralizes it.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ShulkerBullet {
  position: Vec3;
  velocity: Vec3;
  targetId: number;
  ageSec: number;
  destroyed: boolean;
}

const LIFETIME_SEC = 30;
const HOMING_SPEED = 2;
const REDIRECT_INTERVAL_SEC = 0.25;

export function makeShulkerBullet(from: Vec3, targetId: number): ShulkerBullet {
  return {
    position: { ...from },
    velocity: { x: 0, y: HOMING_SPEED, z: 0 },
    targetId,
    ageSec: 0,
    destroyed: false,
  };
}

export interface BulletTickCtx {
  targetPos: Vec3 | null;
  dtSec: number;
}

export interface BulletResult {
  hitTarget: boolean;
  expired: boolean;
}

export function tickShulkerBullet(state: ShulkerBullet, ctx: BulletTickCtx): BulletResult {
  if (state.destroyed) return { hitTarget: false, expired: true };
  state.ageSec += ctx.dtSec;
  // Redirect every 0.25s on a dominant-axis step toward target.
  if (
    ctx.targetPos &&
    Math.floor(state.ageSec / REDIRECT_INTERVAL_SEC) !==
      Math.floor((state.ageSec - ctx.dtSec) / REDIRECT_INTERVAL_SEC)
  ) {
    const dx = ctx.targetPos.x - state.position.x;
    const dy = ctx.targetPos.y - state.position.y;
    const dz = ctx.targetPos.z - state.position.z;
    const absMax = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
    const newVel: Vec3 = { x: 0, y: 0, z: 0 };
    if (Math.abs(dx) === absMax) newVel.x = Math.sign(dx) * HOMING_SPEED;
    else if (Math.abs(dy) === absMax) newVel.y = Math.sign(dy) * HOMING_SPEED;
    else newVel.z = Math.sign(dz) * HOMING_SPEED;
    state.velocity = newVel;
  }
  state.position.x += state.velocity.x * ctx.dtSec;
  state.position.y += state.velocity.y * ctx.dtSec;
  state.position.z += state.velocity.z * ctx.dtSec;

  const hit =
    ctx.targetPos !== null &&
    Math.abs(state.position.x - ctx.targetPos.x) < 0.5 &&
    Math.abs(state.position.y - ctx.targetPos.y) < 0.5 &&
    Math.abs(state.position.z - ctx.targetPos.z) < 0.5;
  return { hitTarget: hit, expired: state.ageSec >= LIFETIME_SEC };
}

export const SHULKER_BULLET_DAMAGE = 4;
export const LEVITATION_ON_HIT_SEC = 10;
