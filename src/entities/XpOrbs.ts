import * as THREE from 'three';
import type { SolidSampler } from '@/physics/collision';

interface XpOrb {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  ageSec: number;
  xp: number;
}

const GRAVITY = 16;
const MAX_LIFETIME_SEC = 300;
const ORB_SIZE = 0.18;

export class XpOrbWorld {
  readonly group: THREE.Group;
  private readonly orbs = new Map<number, XpOrb>();
  private readonly meshes = new Map<number, THREE.Mesh>();
  private readonly sharedGeom: THREE.SphereGeometry;
  private readonly sharedMat: THREE.MeshBasicMaterial;
  private nextId = 1;

  constructor() {
    this.group = new THREE.Group();
    this.sharedGeom = new THREE.SphereGeometry(ORB_SIZE, 8, 6);
    this.sharedMat = new THREE.MeshBasicMaterial({
      color: 0xbfff50,
      transparent: true,
      opacity: 0.95,
    });
  }

  spawn(x: number, y: number, z: number, xp: number): void {
    const orb: XpOrb = {
      id: this.nextId++,
      x,
      y: y + 0.25,
      z,
      vx: (Math.random() - 0.5) * 2,
      vy: 1.5 + Math.random(),
      vz: (Math.random() - 0.5) * 2,
      ageSec: 0,
      xp,
    };
    this.orbs.set(orb.id, orb);
    const mesh = new THREE.Mesh(this.sharedGeom, this.sharedMat);
    mesh.position.set(orb.x, orb.y, orb.z);
    this.meshes.set(orb.id, mesh);
    this.group.add(mesh);
  }

  tick(
    dtSec: number,
    isSolid: SolidSampler,
    playerPos: { x: number; y: number; z: number },
    onPickup: (xp: number) => void,
  ): void {
    const toRemove: number[] = [];
    for (const orb of this.orbs.values()) {
      orb.ageSec += dtSec;
      if (orb.ageSec > MAX_LIFETIME_SEC) {
        toRemove.push(orb.id);
        continue;
      }
      const groundBelow = isSolid(Math.floor(orb.x), Math.floor(orb.y - 0.1), Math.floor(orb.z));
      if (groundBelow && orb.vy <= 0) {
        orb.vy = 0;
        orb.vx *= 0.85;
        orb.vz *= 0.85;
      } else {
        orb.vy -= GRAVITY * dtSec;
      }
      orb.x += orb.vx * dtSec;
      orb.y += orb.vy * dtSec;
      orb.z += orb.vz * dtSec;
      const mesh = this.meshes.get(orb.id);
      if (mesh) {
        mesh.position.set(orb.x, orb.y + Math.sin(orb.ageSec * 3) * 0.06, orb.z);
      }
      const dx = playerPos.x - orb.x;
      const dy = playerPos.y - orb.y;
      const dz = playerPos.z - orb.z;
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < 3 * 3) {
        const len = Math.sqrt(distSq) || 1;
        const pullSpeed = 8;
        orb.x += (dx / len) * pullSpeed * dtSec;
        orb.y += (dy / len) * pullSpeed * dtSec;
        orb.z += (dz / len) * pullSpeed * dtSec;
        if (distSq < 0.5 * 0.5) {
          onPickup(orb.xp);
          toRemove.push(orb.id);
        }
      }
    }
    for (const id of toRemove) {
      const mesh = this.meshes.get(id);
      if (mesh) {
        this.group.remove(mesh);
        this.meshes.delete(id);
      }
      this.orbs.delete(id);
    }
  }

  get size(): number {
    return this.orbs.size;
  }

  clear(): void {
    for (const mesh of this.meshes.values()) this.group.remove(mesh);
    this.meshes.clear();
    this.orbs.clear();
  }
}
