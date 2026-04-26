// ItemEntity: a dropped ItemStack sitting in the world. Subject to gravity,
// magnet-pickup by the player within a radius, auto-despawn after a timer,
// and merge with nearby identical stacks (a single "stack of 64 stones on
// the floor" even if mined over many ticks).

import { sweepMove, type AABB, type SolidSampler } from '@/physics/collision';
import type { ItemStack } from '@/items/item';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ItemEntity {
  readonly id: number;
  stack: ItemStack;
  position: Vec3;
  velocity: Vec3;
  ageSec: number;
  pickupDelaySec: number; // short delay before player can pick up
  onGround: boolean;
}

const AABB_BOX: AABB = { halfX: 0.125, halfY: 0.125, halfZ: 0.125 };
const GRAVITY = 20;
const DRAG = 0.98;
const DESPAWN_SEC = 300;
const MERGE_RADIUS_SQ = 0.5 * 0.5;

export interface ItemEntityTickContext {
  isSolid: SolidSampler;
  playerPos: Vec3 | null;
  pickupRadius: number;
  pickup: (stack: ItemStack) => boolean; // returns true if accepted (inventory had room)
  maxStack: (itemId: number) => number;
}

export class ItemEntityWorld {
  private readonly items = new Map<number, ItemEntity>();
  private nextId = 1;
  // Reused per-tick scratches. toDelete + dv were allocated fresh
  // every tick, and the Array.from snapshot below was a fresh copy of
  // the entire item collection.
  private readonly deleteScratch: number[] = [];
  private readonly dvScratch: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  private readonly entitiesScratch: ItemEntity[] = [];

  spawn(stack: ItemStack, at: Vec3, vel: Vec3 = { x: 0, y: 0.2, z: 0 }): ItemEntity {
    const e: ItemEntity = {
      id: this.nextId++,
      stack,
      position: { ...at },
      velocity: { ...vel },
      ageSec: 0,
      pickupDelaySec: 0.5,
      onGround: false,
    };
    this.items.set(e.id, e);
    return e;
  }

  remove(id: number): void {
    this.items.delete(id);
  }

  all(): IterableIterator<ItemEntity> {
    return this.items.values();
  }

  get size(): number {
    return this.items.size;
  }

  tick(dtSec: number, ctx: ItemEntityTickContext): void {
    const toDelete = this.deleteScratch;
    toDelete.length = 0;
    // Refill the snapshot array in place. Was a fresh Array.from
    // every tick. We need a snapshot (not iterating items.values()
    // directly) because the merge pass below mutates items via
    // toDelete and we don't want to skip an entity while shifting
    // around inside the same iteration.
    const entities = this.entitiesScratch;
    entities.length = 0;
    for (const e of this.items.values()) entities.push(e);

    for (const e of entities) {
      e.ageSec += dtSec;
      if (e.pickupDelaySec > 0) e.pickupDelaySec = Math.max(0, e.pickupDelaySec - dtSec);
      if (e.ageSec >= DESPAWN_SEC) {
        toDelete.push(e.id);
        continue;
      }

      e.velocity.x *= DRAG;
      e.velocity.z *= DRAG;
      e.velocity.y -= GRAVITY * dtSec;

      this.dvScratch.x = e.velocity.x * dtSec;
      this.dvScratch.y = e.velocity.y * dtSec;
      this.dvScratch.z = e.velocity.z * dtSec;
      const r = sweepMove(e.position, AABB_BOX, this.dvScratch, ctx.isSolid);
      if (r.hitX) e.velocity.x = 0;
      if (r.hitY) e.velocity.y = 0;
      if (r.hitZ) e.velocity.z = 0;
      e.onGround = r.onGround;
      if (e.onGround) {
        e.velocity.x *= 0.7;
        e.velocity.z *= 0.7;
      }
    }

    // Merge co-located identical stacks.
    for (let i = 0; i < entities.length; i++) {
      const a = entities[i];
      if (!a || toDelete.includes(a.id)) continue;
      for (let j = i + 1; j < entities.length; j++) {
        const b = entities[j];
        if (!b || toDelete.includes(b.id)) continue;
        if (a.stack.itemId !== b.stack.itemId || a.stack.damage !== b.stack.damage) continue;
        const dx = a.position.x - b.position.x;
        const dy = a.position.y - b.position.y;
        const dz = a.position.z - b.position.z;
        if (dx * dx + dy * dy + dz * dz > MERGE_RADIUS_SQ) continue;
        const cap = ctx.maxStack(a.stack.itemId);
        if (a.stack.count + b.stack.count > cap) continue;
        a.stack = { ...a.stack, count: a.stack.count + b.stack.count };
        toDelete.push(b.id);
      }
    }

    // Player pickup.
    if (ctx.playerPos) {
      const radiusSq = ctx.pickupRadius * ctx.pickupRadius;
      for (const e of entities) {
        if (toDelete.includes(e.id)) continue;
        if (e.pickupDelaySec > 0) continue;
        const dx = ctx.playerPos.x - e.position.x;
        const dy = ctx.playerPos.y - e.position.y;
        const dz = ctx.playerPos.z - e.position.z;
        if (dx * dx + dy * dy + dz * dz > radiusSq) continue;
        if (ctx.pickup(e.stack)) toDelete.push(e.id);
      }
    }

    for (const id of toDelete) this.items.delete(id);
  }
}
