import type { AABB, SolidSampler } from '@/physics/collision';
import { sweepMove } from '@/physics/collision';

export type MobKind = 'pig' | 'zombie' | 'skeleton';

export interface MobDef {
  kind: MobKind;
  aabb: AABB;
  walkSpeed: number;
  maxHealth: number;
  hostile: boolean;
  attackDamage: number;
  attackRangeSq: number;
  aggroRangeSq: number;
}

export const MOB_DEFS: Record<MobKind, MobDef> = {
  pig: {
    kind: 'pig',
    aabb: { halfX: 0.45, halfY: 0.45, halfZ: 0.45 },
    walkSpeed: 1.2,
    maxHealth: 10,
    hostile: false,
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  zombie: {
    kind: 'zombie',
    aabb: { halfX: 0.3, halfY: 0.9, halfZ: 0.3 },
    walkSpeed: 2.0,
    maxHealth: 20,
    hostile: true,
    attackDamage: 2,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  skeleton: {
    kind: 'skeleton',
    aabb: { halfX: 0.3, halfY: 0.9, halfZ: 0.3 },
    walkSpeed: 1.8,
    maxHealth: 20,
    hostile: true,
    attackDamage: 1,
    attackRangeSq: 8 * 8,
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
    if (m.health <= 0) this.mobs.delete(id);
  }

  tick(dtSec: number, ctx: MobTickContext): void {
    for (const mob of this.mobs.values()) this.tickMob(mob, dtSec, ctx);
  }

  private tickMob(mob: Mob, dtSec: number, ctx: MobTickContext): void {
    if (mob.attackCooldownSec > 0)
      mob.attackCooldownSec = Math.max(0, mob.attackCooldownSec - dtSec);

    if (mob.def.hostile && ctx.playerPos) {
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
        if (distSq <= mob.def.attackRangeSq && mob.attackCooldownSec === 0) {
          ctx.damagePlayer(mob.def.attackDamage);
          mob.attackCooldownSec = ATTACK_COOLDOWN_SEC;
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
