import type { AABB, SolidSampler } from '@/physics/collision';
import { sweepMove } from '@/physics/collision';

export type MobKind =
  | 'pig'
  | 'cow'
  | 'sheep'
  | 'chicken'
  | 'wolf'
  | 'zombie'
  | 'skeleton'
  | 'creeper'
  | 'spider'
  | 'enderman'
  | 'ghast'
  | 'blaze'
  | 'piglin'
  | 'wither_skeleton'
  | 'ender_dragon'
  | 'shulker';

export type MobBehavior = 'passive' | 'hostile' | 'neutral' | 'creeper' | 'enderman';

export interface MobDef {
  kind: MobKind;
  aabb: AABB;
  walkSpeed: number;
  maxHealth: number;
  behavior: MobBehavior;
  attackDamage: number;
  attackRangeSq: number;
  aggroRangeSq: number;
  jumpVelocity?: number;
}

const TALL_BOX: AABB = { halfX: 0.3, halfY: 0.9, halfZ: 0.3 };
const MEDIUM_BOX: AABB = { halfX: 0.45, halfY: 0.45, halfZ: 0.45 };
const SMALL_BOX: AABB = { halfX: 0.2, halfY: 0.3, halfZ: 0.2 };
const SPIDER_BOX: AABB = { halfX: 0.7, halfY: 0.45, halfZ: 0.7 };

export const MOB_DEFS: Record<MobKind, MobDef> = {
  pig: {
    kind: 'pig',
    aabb: MEDIUM_BOX,
    walkSpeed: 1.2,
    maxHealth: 10,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  cow: {
    kind: 'cow',
    aabb: MEDIUM_BOX,
    walkSpeed: 1.1,
    maxHealth: 10,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  sheep: {
    kind: 'sheep',
    aabb: MEDIUM_BOX,
    walkSpeed: 1.1,
    maxHealth: 8,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  chicken: {
    kind: 'chicken',
    aabb: SMALL_BOX,
    walkSpeed: 1.4,
    maxHealth: 4,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  wolf: {
    kind: 'wolf',
    aabb: MEDIUM_BOX,
    walkSpeed: 3.0,
    maxHealth: 8,
    behavior: 'neutral',
    attackDamage: 2,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  zombie: {
    kind: 'zombie',
    aabb: TALL_BOX,
    walkSpeed: 2.0,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 2,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  skeleton: {
    kind: 'skeleton',
    aabb: TALL_BOX,
    walkSpeed: 1.8,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 1,
    attackRangeSq: 8 * 8,
    aggroRangeSq: 16 * 16,
  },
  creeper: {
    kind: 'creeper',
    aabb: TALL_BOX,
    walkSpeed: 2.2,
    maxHealth: 20,
    behavior: 'creeper',
    attackDamage: 12,
    attackRangeSq: 2.5 * 2.5,
    aggroRangeSq: 16 * 16,
  },
  spider: {
    kind: 'spider',
    aabb: SPIDER_BOX,
    walkSpeed: 2.4,
    maxHealth: 16,
    behavior: 'hostile',
    attackDamage: 2,
    attackRangeSq: 1.8 * 1.8,
    aggroRangeSq: 16 * 16,
    jumpVelocity: 8,
  },
  enderman: {
    kind: 'enderman',
    aabb: { halfX: 0.3, halfY: 1.45, halfZ: 0.3 },
    walkSpeed: 2.6,
    maxHealth: 40,
    behavior: 'enderman',
    attackDamage: 4,
    attackRangeSq: 2 * 2,
    aggroRangeSq: 24 * 24,
  },
  ghast: {
    kind: 'ghast',
    aabb: { halfX: 2, halfY: 2, halfZ: 2 },
    walkSpeed: 0,
    maxHealth: 10,
    behavior: 'hostile',
    attackDamage: 6,
    attackRangeSq: 48 * 48,
    aggroRangeSq: 64 * 64,
  },
  blaze: {
    kind: 'blaze',
    aabb: { halfX: 0.3, halfY: 0.9, halfZ: 0.3 },
    walkSpeed: 1.5,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 3,
    attackRangeSq: 16 * 16,
    aggroRangeSq: 24 * 24,
  },
  piglin: {
    kind: 'piglin',
    aabb: TALL_BOX,
    walkSpeed: 2.1,
    maxHealth: 16,
    behavior: 'neutral',
    attackDamage: 3,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  wither_skeleton: {
    kind: 'wither_skeleton',
    aabb: { halfX: 0.3, halfY: 1.2, halfZ: 0.3 },
    walkSpeed: 2.2,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 5,
    attackRangeSq: 2 * 2,
    aggroRangeSq: 16 * 16,
  },
  ender_dragon: {
    kind: 'ender_dragon',
    aabb: { halfX: 8, halfY: 4, halfZ: 8 },
    walkSpeed: 0,
    maxHealth: 200,
    behavior: 'hostile',
    attackDamage: 10,
    attackRangeSq: 6 * 6,
    aggroRangeSq: 128 * 128,
  },
  shulker: {
    kind: 'shulker',
    aabb: { halfX: 0.5, halfY: 0.5, halfZ: 0.5 },
    walkSpeed: 0,
    maxHealth: 30,
    behavior: 'hostile',
    attackDamage: 2,
    attackRangeSq: 16 * 16,
    aggroRangeSq: 16 * 16,
  },
};

export type MobId = number;

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Mob {
  readonly id: MobId;
  readonly def: MobDef;
  position: Vec3;
  velocity: Vec3;
  yaw: number;
  health: number;
  onGround: boolean;
  attackCooldownSec: number;
  aggroTargetId: MobId | null;
  // Neutral mobs go aggressive after being struck; wolf keeps a grudge.
  provoked: boolean;
  // Creepers prime a fuse when within attackRange; tracks remaining time.
  fuseSec: number;
  // Endermen teleport randomly on a timer when aggroed.
  teleportCooldownSec: number;
}

const GRAVITY = 32;
const TERMINAL_VELOCITY = 50;
const ATTACK_COOLDOWN_SEC = 0.8;

export interface MobTickContext {
  isSolid: SolidSampler;
  playerPos: Vec3 | null;
  damagePlayer: (amount: number) => void;
}

export class MobWorld {
  private readonly mobs = new Map<MobId, Mob>();
  private nextId: MobId = 1;

  spawn(kind: MobKind, position: Vec3): Mob {
    const def = MOB_DEFS[kind];
    const mob: Mob = {
      id: this.nextId++,
      def,
      position: { ...position },
      velocity: { x: 0, y: 0, z: 0 },
      yaw: 0,
      health: def.maxHealth,
      onGround: false,
      attackCooldownSec: 0,
      aggroTargetId: null,
      provoked: false,
      fuseSec: 0,
      teleportCooldownSec: 0,
    };
    this.mobs.set(mob.id, mob);
    return mob;
  }

  remove(id: MobId): void {
    this.mobs.delete(id);
  }

  all(): IterableIterator<Mob> {
    return this.mobs.values();
  }

  get size(): number {
    return this.mobs.size;
  }

  damage(id: MobId, amount: number): void {
    const m = this.mobs.get(id);
    if (!m) return;
    m.health -= amount;
    if (m.def.behavior === 'neutral' || m.def.behavior === 'enderman') m.provoked = true;
    if (m.health <= 0) this.mobs.delete(id);
  }

  tick(dtSec: number, ctx: MobTickContext): void {
    for (const mob of this.mobs.values()) this.tickMob(mob, dtSec, ctx);
  }

  private isAggroTarget(mob: Mob): boolean {
    switch (mob.def.behavior) {
      case 'passive':
        return false;
      case 'hostile':
      case 'creeper':
        return true;
      case 'neutral':
      case 'enderman':
        return mob.provoked;
    }
  }

  private tickMob(mob: Mob, dtSec: number, ctx: MobTickContext): void {
    if (mob.attackCooldownSec > 0)
      mob.attackCooldownSec = Math.max(0, mob.attackCooldownSec - dtSec);
    if (mob.teleportCooldownSec > 0)
      mob.teleportCooldownSec = Math.max(0, mob.teleportCooldownSec - dtSec);

    const aggro = this.isAggroTarget(mob);
    if (aggro && ctx.playerPos) {
      const dx = ctx.playerPos.x - mob.position.x;
      const dz = ctx.playerPos.z - mob.position.z;
      const distSq = dx * dx + dz * dz;
      if (distSq <= mob.def.aggroRangeSq) {
        const len = Math.sqrt(distSq) || 1;
        const nx = dx / len;
        const nz = dz / len;
        mob.velocity.x = nx * mob.def.walkSpeed;
        mob.velocity.z = nz * mob.def.walkSpeed;
        mob.yaw = Math.atan2(nx, nz);

        if (mob.def.behavior === 'creeper') {
          if (distSq <= mob.def.attackRangeSq) {
            mob.fuseSec += dtSec;
            if (mob.fuseSec >= 1.5) {
              ctx.damagePlayer(mob.def.attackDamage);
              this.mobs.delete(mob.id);
              return;
            }
          } else {
            mob.fuseSec = Math.max(0, mob.fuseSec - dtSec);
          }
        } else if (distSq <= mob.def.attackRangeSq && mob.attackCooldownSec === 0) {
          ctx.damagePlayer(mob.def.attackDamage);
          mob.attackCooldownSec = ATTACK_COOLDOWN_SEC;
        }

        if (mob.def.jumpVelocity && mob.onGround && distSq <= 4 * 4) {
          mob.velocity.y = mob.def.jumpVelocity;
          mob.onGround = false;
        }

        if (mob.def.behavior === 'enderman' && mob.teleportCooldownSec === 0) {
          mob.teleportCooldownSec = 3;
          mob.position.x += (Math.random() - 0.5) * 6;
          mob.position.z += (Math.random() - 0.5) * 6;
        }
      } else {
        mob.velocity.x *= 0.9;
        mob.velocity.z *= 0.9;
      }
    } else {
      mob.velocity.x *= 0.9;
      mob.velocity.z *= 0.9;
    }

    mob.velocity.y = Math.max(mob.velocity.y - GRAVITY * dtSec, -TERMINAL_VELOCITY);

    const dv = {
      x: mob.velocity.x * dtSec,
      y: mob.velocity.y * dtSec,
      z: mob.velocity.z * dtSec,
    };
    const result = sweepMove(mob.position, mob.def.aabb, dv, ctx.isSolid);
    if (result.hitX) mob.velocity.x = 0;
    if (result.hitY) mob.velocity.y = 0;
    if (result.hitZ) mob.velocity.z = 0;
    mob.onGround = result.onGround;
  }
}
