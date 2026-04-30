// Blaze fireball. Small burning projectile that travels in a straight
// line for 1 second, dealing 5 damage + 5 seconds of fire on impact.
//
// Wiki (minecraft.wiki/w/Blaze): "shoots 3 small fireballs over the
// course of 0.9 seconds, then extinguishes its flames and waits for
// 5 seconds before attacking again." 3 shots / 0.9 s = 0.3 s between
// shots; cooldown 5 s. Old code used 0.2 s inter-shot and 3 s
// cooldown — bursts fired ~33% faster and the rest period was 60%
// of wiki, both leading to ~2× the wiki rate of fireballs.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface BlazeFireball {
  id: number;
  position: Vec3;
  velocity: Vec3;
  ageSec: number;
}

const SPEED = 18;
const LIFETIME_SEC = 1.0;
export const BLAZE_FIREBALL_DAMAGE = 5;
export const BLAZE_FIREBALL_IGNITE_SEC = 5;

export function makeFireball(id: number, from: Vec3, dir: Vec3): BlazeFireball {
  const mag = Math.hypot(dir.x, dir.y, dir.z) || 1;
  return {
    id,
    position: { ...from },
    velocity: {
      x: (dir.x / mag) * SPEED,
      y: (dir.y / mag) * SPEED,
      z: (dir.z / mag) * SPEED,
    },
    ageSec: 0,
  };
}

export interface FireballTickCtx {
  isSolid: (x: number, y: number, z: number) => boolean;
  dtSec: number;
}

export interface FireballResult {
  expired: boolean;
  hitBlock: boolean;
}

export function tickFireball(p: BlazeFireball, ctx: FireballTickCtx): FireballResult {
  p.ageSec += ctx.dtSec;
  p.position.x += p.velocity.x * ctx.dtSec;
  p.position.y += p.velocity.y * ctx.dtSec;
  p.position.z += p.velocity.z * ctx.dtSec;
  const hit = ctx.isSolid(
    Math.floor(p.position.x),
    Math.floor(p.position.y),
    Math.floor(p.position.z),
  );
  if (hit) return { expired: true, hitBlock: true };
  if (p.ageSec >= LIFETIME_SEC) return { expired: true, hitBlock: false };
  return { expired: false, hitBlock: false };
}

// Blaze attack state machine: 3-shot burst with inter-shot delay, then
// 3s cooldown.
export interface BlazeAttackState {
  shotsLeftInBurst: number;
  delaySec: number;
  cooldownSec: number;
}

export function makeBlazeAttackState(): BlazeAttackState {
  return { shotsLeftInBurst: 0, delaySec: 0, cooldownSec: 0 };
}

const BURST_SIZE = 3;
const INTER_SHOT_SEC = 0.3;
const BURST_COOLDOWN_SEC = 5;

export interface BlazeAttackCtx {
  hasTarget: boolean;
  dtSec: number;
}

export interface BlazeAttackResult {
  fire: boolean;
}

export function tickBlazeAttack(state: BlazeAttackState, ctx: BlazeAttackCtx): BlazeAttackResult {
  state.cooldownSec = Math.max(0, state.cooldownSec - ctx.dtSec);
  state.delaySec = Math.max(0, state.delaySec - ctx.dtSec);
  if (!ctx.hasTarget) {
    state.shotsLeftInBurst = 0;
    return { fire: false };
  }
  if (state.shotsLeftInBurst === 0 && state.cooldownSec === 0) {
    state.shotsLeftInBurst = BURST_SIZE;
  }
  if (state.shotsLeftInBurst > 0 && state.delaySec === 0) {
    state.shotsLeftInBurst--;
    state.delaySec = INTER_SHOT_SEC;
    if (state.shotsLeftInBurst === 0) state.cooldownSec = BURST_COOLDOWN_SEC;
    return { fire: true };
  }
  return { fire: false };
}
