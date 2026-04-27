import * as THREE from 'three';
import type { SolidSampler } from '@/physics/collision';

export interface DroppedItemData {
  itemId: number;
  count: number;
  color: readonly [number, number, number];
  // Tool/armor damage. Was missing — dropping a 50% diamond sword and
  // picking it back up returned a fresh full-durability one. Default 0
  // (intact) so non-tool items don't have to pass it.
  damage?: number;
}

interface DroppedItem {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  ageSec: number;
  pickupDelaySec: number;
  data: DroppedItemData;
}

const GRAVITY = 22;
const DRAG_GROUND = 0.8;
const MAX_LIFETIME_SEC = 300;
const ITEM_SIZE = 0.25;

export interface PickupOutcome {
  itemId: number;
  count: number;
  damage?: number;
}

export class DroppedItemWorld {
  readonly group: THREE.Group;
  private readonly items = new Map<number, DroppedItem>();
  private readonly meshes = new Map<number, THREE.Mesh>();
  private readonly sharedGeom: THREE.BoxGeometry;
  private readonly materialPool = new Map<number, THREE.MeshBasicMaterial>();
  private nextId = 1;
  private mergeAccumSec = 0;
  private mergeDirty = false;
  // Reused per-tick scratch list — was allocated fresh each call.
  private readonly toRemoveScratch: number[] = [];
  // Reused PickupOutcome scratch passed to the onPickup callback.
  // The callback reads itemId/count/damage synchronously into its own
  // scratch (main's pickupAddArg) and never retains the reference, so
  // a single shared object is safe and skips one fresh literal per
  // pickup attempt — meaningful when the player walks through a pile
  // of dropped items at a mob farm or chest break.
  private readonly pickupOutScratch: PickupOutcome = { itemId: 0, count: 0 };

  constructor() {
    this.group = new THREE.Group();
    // Group sits at world origin; per-item meshes carry their own
    // positions. Skip three.js's per-frame group matrix update.
    this.group.matrixAutoUpdate = false;
    this.group.updateMatrix();
    this.sharedGeom = new THREE.BoxGeometry(ITEM_SIZE, ITEM_SIZE, ITEM_SIZE);
  }

  private materialFor(r: number, g: number, b: number): THREE.MeshBasicMaterial {
    const key = (r << 16) | (g << 8) | b;
    const existing = this.materialPool.get(key);
    if (existing) return existing;
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(r / 255, g / 255, b / 255),
    });
    this.materialPool.set(key, mat);
    return mat;
  }

  spawn(x: number, y: number, z: number, data: DroppedItemData, kick = 2): void {
    const angle = Math.random() * Math.PI * 2;
    const it: DroppedItem = {
      id: this.nextId++,
      x,
      y: y + 0.3,
      z,
      vx: Math.cos(angle) * kick * Math.random(),
      vy: 2.5 + Math.random() * 1,
      vz: Math.sin(angle) * kick * Math.random(),
      ageSec: 0,
      pickupDelaySec: 0.35,
      data,
    };
    this.items.set(it.id, it);
    this.mergeDirty = true;
    const [r, g, b] = data.color;
    const mesh = new THREE.Mesh(this.sharedGeom, this.materialFor(r, g, b));
    mesh.position.set(it.x, it.y, it.z);
    const scale = 1 + Math.log10(Math.max(1, data.count)) * 0.6;
    mesh.scale.setScalar(scale);
    this.meshes.set(it.id, mesh);
    this.group.add(mesh);
  }

  private updateMeshScale(id: number, count: number): void {
    const mesh = this.meshes.get(id);
    if (!mesh) return;
    const scale = 1 + Math.log10(Math.max(1, count)) * 0.6;
    mesh.scale.setScalar(scale);
  }

  // onPickup may return leftover count — entity stays (with reduced
  // count) when leftover > 0. Returning undefined = treat as full pickup.
  tick(
    dtSec: number,
    isSolid: SolidSampler,
    playerPos: { x: number; y: number; z: number },
    onPickup: (out: PickupOutcome) => number | undefined,
  ): void {
    // Skip the entire tick when no items exist. The per-tick scratches
    // (toRemove + mergeAccumSec) only matter if we do work; otherwise
    // we'd just clear, no-op iterate, and clear again.
    if (this.items.size === 0) return;
    const toRemove = this.toRemoveScratch;
    toRemove.length = 0;
    const twoPi = Math.PI * 2;
    // O(n^2) merge ran every tick — at chest break / mob farm sites this
    // burned big CPU. Run only on dirty (new spawn) or every 0.5s for
    // moving-into-each-other items, and only when there are enough items.
    this.mergeAccumSec += dtSec;
    if (this.items.size >= 2 && (this.mergeDirty || this.mergeAccumSec >= 0.5)) {
      this.mergeAccumSec = 0;
      this.mergeDirty = false;
      this.mergeNearby();
    }
    for (const it of this.items.values()) {
      it.ageSec += dtSec;
      it.pickupDelaySec = Math.max(0, it.pickupDelaySec - dtSec);
      if (it.ageSec > MAX_LIFETIME_SEC) {
        toRemove.push(it.id);
        continue;
      }
      const groundBelow = isSolid(Math.floor(it.x), Math.floor(it.y - 0.15), Math.floor(it.z));
      if (groundBelow && it.vy <= 0) {
        it.vy = 0;
        it.vx *= DRAG_GROUND;
        it.vz *= DRAG_GROUND;
      } else {
        it.vy -= GRAVITY * dtSec;
      }
      it.x += it.vx * dtSec;
      it.y += it.vy * dtSec;
      it.z += it.vz * dtSec;
      if (it.y < -20) {
        toRemove.push(it.id);
        continue;
      }

      const mesh = this.meshes.get(it.id);
      if (mesh) {
        mesh.position.set(it.x, it.y + Math.sin(it.ageSec * 2) * 0.08, it.z);
        mesh.rotation.y = (it.ageSec * 1.2) % twoPi;
      }

      if (it.pickupDelaySec === 0) {
        const dx = playerPos.x - it.x;
        const dy = playerPos.y - it.y;
        const dz = playerPos.z - it.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < 1.6 * 1.6) {
          const pullSpeed = 7;
          const len = Math.sqrt(distSq) || 1;
          const pullX = (dx / len) * pullSpeed * dtSec;
          const pullY = (dy / len) * pullSpeed * dtSec;
          const pullZ = (dz / len) * pullSpeed * dtSec;
          it.x += pullX;
          it.y += pullY;
          it.z += pullZ;
          if (distSq < 0.5 * 0.5) {
            const out = this.pickupOutScratch;
            out.itemId = it.data.itemId;
            out.count = it.data.count;
            // The callback reads damage with `?? 0`, so passing 0 for
            // missing damage is observationally identical and keeps the
            // scratch fields strictly typed as numbers.
            out.damage = it.data.damage ?? 0;
            const leftover = onPickup(out);
            if (leftover === undefined || leftover <= 0) {
              toRemove.push(it.id);
            } else if (leftover < it.data.count) {
              // Partial pickup — keep the entity but lower its count and
              // re-arm the pickup delay so the player has a chance to
              // make space before it re-fires.
              it.data = { ...it.data, count: leftover };
              this.updateMeshScale(it.id, leftover);
              it.pickupDelaySec = 1.0;
            } else {
              // Inventory full — push the pickup attempt out so we don't
              // spam onPickup every frame while the player stands here.
              it.pickupDelaySec = 1.0;
            }
          }
        }
      }
    }
    for (const id of toRemove) {
      const mesh = this.meshes.get(id);
      if (mesh) {
        this.group.remove(mesh);
        this.meshes.delete(id);
      }
      this.items.delete(id);
    }
  }

  private mergeNearby(): void {
    const arr = Array.from(this.items.values());
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];
      if (!a) continue;
      if (!this.items.has(a.id)) continue;
      for (let j = i + 1; j < arr.length; j++) {
        const b = arr[j];
        if (!b) continue;
        if (!this.items.has(b.id)) continue;
        if (a.data.itemId !== b.data.itemId) continue;
        // Only merge stacks with identical durability — otherwise two
        // damaged tools would coalesce and the worse one's wear value
        // would be silently lost.
        if ((a.data.damage ?? 0) !== (b.data.damage ?? 0)) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        if (dx * dx + dy * dy + dz * dz > 0.6 * 0.6) continue;
        a.data = { ...a.data, count: a.data.count + b.data.count };
        this.updateMeshScale(a.id, a.data.count);
        const mesh = this.meshes.get(b.id);
        if (mesh) {
          this.group.remove(mesh);
          this.meshes.delete(b.id);
        }
        this.items.delete(b.id);
      }
    }
  }

  get size(): number {
    return this.items.size;
  }

  // Shared mutable position scratch + iterator wrappers. Was
  // allocating an Iterable wrapper, an Iterator wrapper, an
  // IteratorResult, AND a fresh {x,z} value object per iteration.
  // Callers (minimap) read x/z synchronously before .next(), so the
  // value object is safe to share. The wrappers are reused too.
  private readonly positionsIterValue = { x: 0, z: 0 };
  private readonly positionsIterResult: IteratorResult<{ x: number; z: number }> = {
    done: false,
    value: this.positionsIterValue,
  };
  private positionsIterMapIter: IterableIterator<DroppedItem> | null = null;
  private readonly positionsIter: Iterator<{ x: number; z: number }> = {
    next: (): IteratorResult<{ x: number; z: number }> => {
      const it = this.positionsIterMapIter;
      if (!it) {
        return { done: true, value: undefined };
      }
      const n = it.next();
      if (n.done) {
        this.positionsIterMapIter = null;
        return { done: true, value: undefined };
      }
      this.positionsIterValue.x = n.value.x;
      this.positionsIterValue.z = n.value.z;
      this.positionsIterResult.done = false;
      this.positionsIterResult.value = this.positionsIterValue;
      return this.positionsIterResult;
    },
  };
  private readonly positionsIterable: Iterable<{ x: number; z: number }> = {
    [Symbol.iterator]: (): Iterator<{ x: number; z: number }> => {
      this.positionsIterMapIter = this.items.values();
      return this.positionsIter;
    },
  };

  positions(): Iterable<{ x: number; z: number }> {
    return this.positionsIterable;
  }

  clear(): void {
    for (const mesh of this.meshes.values()) {
      this.group.remove(mesh);
    }
    this.meshes.clear();
    this.items.clear();
    for (const mat of this.materialPool.values()) mat.dispose();
    this.materialPool.clear();
  }
}
