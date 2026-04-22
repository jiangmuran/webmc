// Thrown egg — short-range projectile. 1/8 chance to spawn a baby chicken
// on impact, plus a 1/256 chance for it to spawn 4 chickens.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ThrownEgg {
  position: Vec3;
  velocity: Vec3;
  ageSec: number;
}

const LIFETIME_SEC = 30;

export function makeThrownEgg(from: Vec3, dir: Vec3, speed: number): ThrownEgg {
  return {
    position: { ...from },
    velocity: { x: dir.x * speed, y: dir.y * speed, z: dir.z * speed },
    ageSec: 0,
  };
}

export interface EggTickCtx {
  isSolid: (x: number, y: number, z: number) => boolean;
  dtSec: number;
}

export interface EggTickResult {
  impacted: boolean;
  chicksSpawned: number;
  expired: boolean;
}

export function tickThrownEgg(
  state: ThrownEgg,
  ctx: EggTickCtx,
  rng: () => number = Math.random,
): EggTickResult {
  state.ageSec += ctx.dtSec;
  state.position.x += state.velocity.x * ctx.dtSec;
  state.position.y += state.velocity.y * ctx.dtSec;
  state.position.z += state.velocity.z * ctx.dtSec;
  state.velocity.y -= 20 * ctx.dtSec;
  const bx = Math.floor(state.position.x);
  const by = Math.floor(state.position.y);
  const bz = Math.floor(state.position.z);
  if (ctx.isSolid(bx, by, bz) || state.ageSec >= LIFETIME_SEC) {
    let chicks = 0;
    if (rng() < 1 / 8) chicks = rng() < 1 / 32 ? 4 : 1;
    return { impacted: true, chicksSpawned: chicks, expired: state.ageSec >= LIFETIME_SEC };
  }
  return { impacted: false, chicksSpawned: 0, expired: false };
}
