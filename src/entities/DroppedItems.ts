import * as THREE from 'three';
import type { SolidSampler } from '@/physics/collision';

export interface DroppedItemData {
  itemId: number;
  count: number;
  color: readonly [number, number, number];
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
}

export class DroppedItemWorld {
  readonly group: THREE.Group;
  private readonly items = new Map<number, DroppedItem>();
  private readonly meshes = new Map<number, THREE.Mesh>();
  private readonly sharedGeom: THREE.BoxGeometry;
  private readonly materialPool = new Map<number, THREE.MeshBasicMaterial>();
  private nextId = 1;

  constructor() {
    this.group = new THREE.Group();
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

  tick(
    dtSec: number,
    isSolid: SolidSampler,
    playerPos: { x: number; y: number; z: number },
    onPickup: (out: PickupOutcome) => void,
  ): void {
    const toRemove: number[] = [];
    const twoPi = Math.PI * 2;
    this.mergeNearby();
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
            onPickup({ itemId: it.data.itemId, count: it.data.count });
            toRemove.push(it.id);
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

  positions(): Iterable<{ x: number; z: number }> {
    const vals = this.items.values();
    return {
      [Symbol.iterator](): Iterator<{ x: number; z: number }> {
        return {
          next(): IteratorResult<{ x: number; z: number }> {
            const n = vals.next();
            if (n.done) return { done: true, value: undefined };
            return { done: false, value: { x: n.value.x, z: n.value.z } };
          },
        };
      },
    };
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
