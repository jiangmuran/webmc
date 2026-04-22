// Bottle o' Enchanting. Thrown projectile that bursts on impact, dropping
// 3-11 XP orbs at its landing position.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface XpBottle {
  position: Vec3;
  velocity: Vec3;
  ageSec: number;
}

export function makeXpBottle(from: Vec3, dir: Vec3, speed: number): XpBottle {
  return {
    position: { ...from },
    velocity: { x: dir.x * speed, y: dir.y * speed, z: dir.z * speed },
    ageSec: 0,
  };
}

export interface BottleTickCtx {
  isSolid: (x: number, y: number, z: number) => boolean;
  dtSec: number;
}

export interface BottleTickResult {
  shattered: boolean;
  xpDropped: number;
}

export function tickXpBottle(
  state: XpBottle,
  ctx: BottleTickCtx,
  rng: () => number = Math.random,
): BottleTickResult {
  state.ageSec += ctx.dtSec;
  state.position.x += state.velocity.x * ctx.dtSec;
  state.position.y += state.velocity.y * ctx.dtSec;
  state.position.z += state.velocity.z * ctx.dtSec;
  state.velocity.y -= 8 * ctx.dtSec; // lighter gravity for thrown bottle
  const bx = Math.floor(state.position.x);
  const by = Math.floor(state.position.y);
  const bz = Math.floor(state.position.z);
  if (ctx.isSolid(bx, by, bz)) {
    const drop = 3 + Math.floor(rng() * 9); // 3..11
    return { shattered: true, xpDropped: drop };
  }
  return { shattered: false, xpDropped: 0 };
}
