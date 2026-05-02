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

// Wiki (minecraft.wiki/w/Snowball): "Snowballs deal 3 damage to
// blazes ... 0 damage to other mobs (besides knockback)."
// Endermen are immune to projectiles — a snowball triggers their
// teleport-away response but deals 0 damage. Old code returned 2
// for enderman ('deflected — counts as hurt'); that's not in the
// wiki and conflicts with sibling snowball_impact.ts which returns
// 0 for everything but blaze.
export function damageOnHit(victimKind: string): number {
  if (victimKind === 'blaze') return 3;
  return 0;
}

export const SNOWBALL_KNOCKBACK = 0.4;
