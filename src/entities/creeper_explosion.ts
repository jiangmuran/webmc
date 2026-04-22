// Creeper fuse + explosion. A creeper starts fusing when within 3 blocks
// of a player; 1.5s of fuse before detonating (power 3 base, power 6 if
// charged by lightning). Cat nearby makes creepers flee.

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
  escape: boolean; // player moved out of fuse range
}

export interface CreeperTickResult {
  explode: boolean;
  power: number;
}

const FUSE_RADIUS = 3;

export function tickCreeper(state: CreeperState, ctx: CreeperTickCtx): CreeperTickResult {
  if (state.health <= 0) return { explode: false, power: 0 };
  if (ctx.catNearby) {
    state.fleeing = true;
    state.fuseSec = 0;
    return { explode: false, power: 0 };
  }
  state.fleeing = false;
  if (ctx.playerDistance <= FUSE_RADIUS) {
    state.fuseSec += ctx.dtSec;
    if (state.fuseSec >= FUSE_DURATION_SEC) {
      return {
        explode: true,
        power: state.charged ? CHARGED_EXPLOSION_POWER : EXPLOSION_POWER,
      };
    }
  } else if (ctx.escape) {
    state.fuseSec = 0;
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
