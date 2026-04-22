import * as THREE from 'three';
import type { Mob, MobKind } from '@/entities/mob';

const COLORS: Record<MobKind, number> = {
  pig: 0xf4a4b8,
  zombie: 0x5a8a4d,
  skeleton: 0xcfcfcf,
};

export class MobRenderer {
  readonly group = new THREE.Group();
  private readonly meshes = new Map<number, THREE.Mesh>();
  private readonly geoms = new Map<MobKind, THREE.BoxGeometry>();

  constructor() {
    this.group.name = 'webmc-mob-group';
  }

  private geometryFor(mob: Mob): THREE.BoxGeometry {
    const existing = this.geoms.get(mob.def.kind);
    if (existing) return existing;
    const g = new THREE.BoxGeometry(
      mob.def.aabb.halfX * 2,
      mob.def.aabb.halfY * 2,
      mob.def.aabb.halfZ * 2,
    );
    this.geoms.set(mob.def.kind, g);
    return g;
  }

  sync(mobs: IterableIterator<Mob>): void {
    const seen = new Set<number>();
    for (const mob of mobs) {
      seen.add(mob.id);
      let mesh = this.meshes.get(mob.id);
      if (!mesh) {
        const mat = new THREE.MeshBasicMaterial({ color: COLORS[mob.def.kind] });
        mesh = new THREE.Mesh(this.geometryFor(mob), mat);
        mesh.name = `mob-${String(mob.id)}`;
        this.meshes.set(mob.id, mesh);
        this.group.add(mesh);
      }
      mesh.position.set(mob.position.x, mob.position.y, mob.position.z);
      mesh.rotation.y = mob.yaw;
    }
    for (const [id, mesh] of this.meshes) {
      if (seen.has(id)) continue;
      (mesh.material as THREE.MeshBasicMaterial).dispose();
      this.group.remove(mesh);
      this.meshes.delete(id);
    }
  }

  clear(): void {
    for (const m of this.meshes.values()) {
      (m.material as THREE.MeshBasicMaterial).dispose();
      this.group.remove(m);
    }
    this.meshes.clear();
    for (const g of this.geoms.values()) g.dispose();
    this.geoms.clear();
  }

  get count(): number {
    return this.meshes.size;
  }
}
