// Creeper fuse + explosion. Wiki (minecraft.wiki/w/Creeper):
// "When within 3 blocks of a player … explodes after 1.5 seconds
// (30 ticks) … the distance that the player must move in order
// for a creeper to cancel its explosion is 7 blocks." So the fuse
// ignites at ≤ 3 but only cancels when > 7 — between 3 and 7 the
// fuse continues to count down. Old code only advanced the fuse
// while ≤ 3 (so a player who stepped to 4 blocks would freeze the
// fuse instead of letting it complete) and let the caller flip
// `ctx.escape` for cancellation. Cat-nearby makes creepers flee.
//
// Sibling creeper_swell.ts already uses the wiki-correct ignite=3 /
// cancel=7 split.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface CreeperState {
  id: number;
  position: Vec3;
  charged: boolean;
  fuseSec: number;
  health: number;
  fleeing: boolean;
}

export const CREEPER_MAX_HEALTH = 20;
export const FUSE_DURATION_SEC = 1.5;
const EXPLOSION_POWER = 3;
const CHARGED_EXPLOSION_POWER = 6;

export function makeCreeper(id: number, at: Vec3, charged = false): CreeperState {
  return {
    id,
    position: { ...at },
    charged,
    fuseSec: 0,
    health: CREEPER_MAX_HEALTH,
    fleeing: false,
  };
}

export interface CreeperTickCtx {
  playerDistance: number;
  catNearby: boolean;
  dtSec: number;
  /** Forced cancel from caller (e.g. obstruction, fluid). */
  escape: boolean;
}

export interface CreeperTickResult {
  explode: boolean;
  power: number;
}

export const IGNITE_RANGE = 3;
export const CANCEL_RANGE = 7;

export function tickCreeper(state: CreeperState, ctx: CreeperTickCtx): CreeperTickResult {
  if (state.health <= 0) return { explode: false, power: 0 };
  if (ctx.catNearby) {
    state.fleeing = true;
    state.fuseSec = 0;
    return { explode: false, power: 0 };
  }
  state.fleeing = false;
  // Forced cancel or player past 7-block threshold — reset.
  if (ctx.escape || ctx.playerDistance > CANCEL_RANGE) {
    state.fuseSec = 0;
    return { explode: false, power: 0 };
  }
  // Sustain or ignite. Already swelling? Keep going regardless of
  // 3-vs-7 (wiki: only > 7 cancels). Not yet swelling? Ignite at ≤ 3.
  if (state.fuseSec > 0 || ctx.playerDistance <= IGNITE_RANGE) {
    state.fuseSec += ctx.dtSec;
    if (state.fuseSec >= FUSE_DURATION_SEC) {
      return {
        explode: true,
        power: state.charged ? CHARGED_EXPLOSION_POWER : EXPLOSION_POWER,
      };
    }
  }
  return { explode: false, power: 0 };
}

// Lightning strike within 4 blocks of a creeper converts it to charged.
export const CHARGE_LIGHTNING_RADIUS = 4;

export function tryChargeByLightning(state: CreeperState, lightningPos: Vec3): boolean {
  const dx = lightningPos.x - state.position.x;
  const dy = lightningPos.y - state.position.y;
  const dz = lightningPos.z - state.position.z;
  if (Math.hypot(dx, dy, dz) > CHARGE_LIGHTNING_RADIUS) return false;
  state.charged = true;
  return true;
}
