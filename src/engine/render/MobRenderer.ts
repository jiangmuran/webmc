import * as THREE from 'three';
import type { Mob, MobKind } from '@/entities/mob';

const COLORS: Record<MobKind, number> = {
  pig: 0xf4a4b8,
  cow: 0x8b5a3c,
  sheep: 0xeeeeee,
  chicken: 0xfafafa,
  wolf: 0xbfbfbf,
  zombie: 0x5a8a4d,
  skeleton: 0xcfcfcf,
  creeper: 0x4caf50,
  spider: 0x2a1d1d,
  enderman: 0x151520,
  ghast: 0xe6e1d8,
  blaze: 0xffcb4a,
  piglin: 0xd3a888,
  wither_skeleton: 0x262626,
  ender_dragon: 0x0a0a1a,
  shulker: 0x9f8ea0,
  pillager: 0x5a5448,
  vindicator: 0x807a6d,
  evoker: 0x555555,
  iron_golem: 0xdaddcf,
  snow_golem: 0xfafcff,
  bee: 0xf2c14e,
  axolotl: 0xf9b8d0,
  frog: 0x8aa23a,
  warden: 0x0d3437,
  fox: 0xd39853,
  goat: 0xe0d9c2,
  horse: 0xc29872,
  rabbit: 0xbfa684,
  squid: 0x6a3f63,
  cat: 0xc0a577,
  parrot: 0x5ec1ff,
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
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mob.hurtFlashSec > 0) {
        const base = COLORS[mob.def.kind];
        const r = ((base >> 16) & 0xff) / 255;
        const g = ((base >> 8) & 0xff) / 255;
        const b = (base & 0xff) / 255;
        const k = Math.min(1, mob.hurtFlashSec / 0.18);
        mat.color.setRGB(r * (1 - k) + 1 * k, g * (1 - k) + 0.2 * k, b * (1 - k) + 0.2 * k);
      } else {
        mat.color.setHex(COLORS[mob.def.kind]);
      }
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
