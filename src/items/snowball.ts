// Snowball. Light projectile, knockback only for most mobs, 3 HP damage
// to blazes, stackable in player inventory.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Snowball {
  position: Vec3;
  velocity: Vec3;
  ownerId: number | null;
  ageSec: number;
}

const LIFETIME_SEC = 20;

export function makeSnowball(from: Vec3, dir: Vec3, ownerId: number | null = null): Snowball {
  const speed = 8;
  return {
    position: { ...from },
    velocity: { x: dir.x * speed, y: dir.y * speed + 0.3, z: dir.z * speed },
    ownerId,
    ageSec: 0,
  };
}

export interface SnowballTickCtx {
  isSolid: (x: number, y: number, z: number) => boolean;
  dtSec: number;
}

export interface SnowballResult {
  impacted: boolean;
  expired: boolean;
}

export function tickSnowball(state: Snowball, ctx: SnowballTickCtx): SnowballResult {
  state.ageSec += ctx.dtSec;
  state.velocity.y -= 12 * ctx.dtSec;
  state.position.x += state.velocity.x * ctx.dtSec;
  state.position.y += state.velocity.y * ctx.dtSec;
  state.position.z += state.velocity.z * ctx.dtSec;
  const bx = Math.floor(state.position.x);
  const by = Math.floor(state.position.y);
  const bz = Math.floor(state.position.z);
  if (ctx.isSolid(bx, by, bz)) return { impacted: true, expired: false };
  return { impacted: false, expired: state.ageSec >= LIFETIME_SEC };
}

export function damageOnHit(victimKind: string): number {
  if (victimKind === 'blaze') return 3;
  if (victimKind === 'enderman') return 2; // deflected — counts as hurt
  return 0;
}

export const SNOWBALL_KNOCKBACK = 0.4;
