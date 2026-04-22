// Lightweight projectile simulation. Deterministic kinematic integrator +
// AABB-vs-voxel swept collision; reports whether the projectile hit a solid
// this tick and what (if anything) it hit. Integration into MobWorld +
// damage application lives in the main loop — this module is pure.

import { sweepMove, type AABB, type SolidSampler } from '@/physics/collision';

export type ProjectileKind =
  | 'arrow'
  | 'fireball'
  | 'snowball'
  | 'egg'
  | 'ender_pearl'
  | 'splash_potion';

export interface ProjectileDef {
  kind: ProjectileKind;
  aabb: AABB;
  gravity: number; // positive = falls down
  drag: number; // 0..1 per tick (multiplier)
  lifetimeSec: number;
  damage: number;
  ignitesTargets: boolean;
}

export const PROJECTILE_DEFS: Record<ProjectileKind, ProjectileDef> = {
  arrow: {
    kind: 'arrow',
    aabb: { halfX: 0.1, halfY: 0.1, halfZ: 0.1 },
    gravity: 20,
    drag: 0.99,
    lifetimeSec: 60,
    damage: 2,
    ignitesTargets: false,
  },
  fireball: {
    kind: 'fireball',
    aabb: { halfX: 0.25, halfY: 0.25, halfZ: 0.25 },
    gravity: 0,
    drag: 0.95,
    lifetimeSec: 30,
    damage: 5,
    ignitesTargets: true,
  },
  snowball: {
    kind: 'snowball',
    aabb: { halfX: 0.1, halfY: 0.1, halfZ: 0.1 },
    gravity: 6,
    drag: 0.99,
    lifetimeSec: 10,
    damage: 0,
    ignitesTargets: false,
  },
  egg: {
    kind: 'egg',
    aabb: { halfX: 0.1, halfY: 0.1, halfZ: 0.1 },
    gravity: 6,
    drag: 0.99,
    lifetimeSec: 10,
    damage: 0,
    ignitesTargets: false,
  },
  ender_pearl: {
    kind: 'ender_pearl',
    aabb: { halfX: 0.1, halfY: 0.1, halfZ: 0.1 },
    gravity: 6,
    drag: 0.99,
    lifetimeSec: 20,
    damage: 0,
    ignitesTargets: false,
  },
  splash_potion: {
    kind: 'splash_potion',
    aabb: { halfX: 0.15, halfY: 0.15, halfZ: 0.15 },
    gravity: 6,
    drag: 0.99,
    lifetimeSec: 15,
    damage: 0,
    ignitesTargets: false,
  },
};

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Projectile {
  readonly id: number;
  readonly kind: ProjectileKind;
  readonly def: ProjectileDef;
  position: Vec3;
  velocity: Vec3;
  ageSec: number;
  ownerId: number | null;
  stuck: boolean;
}

export type EntityHitCheck = (p: Projectile) => { entityId: number; hitPoint: Vec3 } | null;

export interface ProjectileTickContext {
  isSolid: SolidSampler;
  hitEntity?: EntityHitCheck;
}

export interface TickResult {
  projectile: Projectile;
  hitBlock: boolean;
  hitEntityId: number | null;
  expired: boolean;
}

export class ProjectileWorld {
  private readonly items = new Map<number, Projectile>();
  private nextId = 1;

  spawn(kind: ProjectileKind, from: Vec3, vel: Vec3, ownerId: number | null): Projectile {
    const def = PROJECTILE_DEFS[kind];
    const p: Projectile = {
      id: this.nextId++,
      kind,
      def,
      position: { ...from },
      velocity: { ...vel },
      ageSec: 0,
      ownerId,
      stuck: false,
    };
    this.items.set(p.id, p);
    return p;
  }

  remove(id: number): void {
    this.items.delete(id);
  }

  all(): IterableIterator<Projectile> {
    return this.items.values();
  }

  get size(): number {
    return this.items.size;
  }

  tick(dtSec: number, ctx: ProjectileTickContext): readonly TickResult[] {
    const results: TickResult[] = [];
    const toDelete: number[] = [];
    for (const p of this.items.values()) {
      if (p.stuck) {
        p.ageSec += dtSec;
        if (p.ageSec >= p.def.lifetimeSec) {
          toDelete.push(p.id);
          results.push({ projectile: p, hitBlock: false, hitEntityId: null, expired: true });
        }
        continue;
      }

      p.velocity.y -= p.def.gravity * dtSec;
      p.velocity.x *= p.def.drag;
      p.velocity.y *= p.def.drag;
      p.velocity.z *= p.def.drag;

      const dv = { x: p.velocity.x * dtSec, y: p.velocity.y * dtSec, z: p.velocity.z * dtSec };
      const move = sweepMove(p.position, p.def.aabb, dv, ctx.isSolid);
      const hitBlock = move.hitX || move.hitY || move.hitZ;

      let hitEntityId: number | null = null;
      if (ctx.hitEntity) {
        const h = ctx.hitEntity(p);
        if (h !== null) hitEntityId = h.entityId;
      }

      p.ageSec += dtSec;
      const expired = p.ageSec >= p.def.lifetimeSec;

      if (hitBlock || hitEntityId !== null || expired) {
        p.stuck = hitBlock && hitEntityId === null;
        if (!p.stuck) toDelete.push(p.id);
        results.push({ projectile: p, hitBlock, hitEntityId, expired });
      }
    }
    for (const id of toDelete) this.items.delete(id);
    return results;
  }
}
