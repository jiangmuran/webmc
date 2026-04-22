// Snow golem. Shoots snowballs at nearby hostiles; leaves snow trail
// while walking on snow-compatible blocks; melts in hot biomes or water.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SnowGolemState {
  attackCooldownSec: number;
  trailCooldownSec: number;
  hp: number;
}

const SHOOT_INTERVAL_SEC = 1;
const TRAIL_INTERVAL_SEC = 0.4;
const MELT_HP_PER_SEC = 0.5;

export function makeSnowGolem(): SnowGolemState {
  return { attackCooldownSec: 0, trailCooldownSec: 0, hp: 4 };
}

export interface GolemTickCtx {
  dtSec: number;
  nearbyHostileTargetId: number | null;
  inHotBiome: boolean;
  inWater: boolean;
  onSnowableSurface: boolean;
}

export interface GolemTickResult {
  fireSnowballAt: number | null;
  placeSnowLayer: boolean;
  melted: boolean;
}

export function tickSnowGolem(state: SnowGolemState, ctx: GolemTickCtx): GolemTickResult {
  let fireAt: number | null = null;
  state.attackCooldownSec = Math.max(0, state.attackCooldownSec - ctx.dtSec);
  state.trailCooldownSec = Math.max(0, state.trailCooldownSec - ctx.dtSec);
  if (ctx.nearbyHostileTargetId !== null && state.attackCooldownSec <= 0) {
    fireAt = ctx.nearbyHostileTargetId;
    state.attackCooldownSec = SHOOT_INTERVAL_SEC;
  }
  let placeSnow = false;
  if (ctx.onSnowableSurface && state.trailCooldownSec <= 0) {
    placeSnow = true;
    state.trailCooldownSec = TRAIL_INTERVAL_SEC;
  }
  if (ctx.inHotBiome || ctx.inWater) {
    state.hp -= MELT_HP_PER_SEC * ctx.dtSec;
  }
  return { fireSnowballAt: fireAt, placeSnowLayer: placeSnow, melted: state.hp <= 0 };
}

export const SNOWBALL_DAMAGE_TO_BLAZE = 3; // special case
export const SNOWBALL_BASE_DAMAGE = 0;
