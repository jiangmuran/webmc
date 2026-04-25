import * as THREE from 'three';
import type { Mob, MobKind } from '@/entities/mob';

const COLORS: Record<string, number> = {
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
  phantom: 0x4a4070,
  dolphin: 0x9ec4d6,
  turtle: 0x6db96a,
  guardian: 0x607a6a,
  elder_guardian: 0x8895a0,
  vex: 0xb8c0d0,
  breeze: 0xb8e8ff,
  drowned: 0x4a8a78,
  husk: 0xb8a878,
  stray: 0xd8e0e8,
  bogged: 0xa8c0a0,
  glow_squid: 0x4ee0ff,
  slime: 0x6ad06a,
  magma_cube: 0xff6a30,
  wandering_trader: 0x4a4a8a,
  llama: 0xe8d8b8,
  trader_llama: 0xc89878,
  ravager: 0x484038,
  ocelot: 0xe0c878,
  polar_bear: 0xfcfcfc,
  panda: 0xf0f0f0,
  hoglin: 0xc06070,
  zoglin: 0xa05060,
  strider: 0xc04848,
  zombified_piglin: 0x80a060,
  piglin_brute: 0xb09070,
  camel: 0xe0c898,
};

const DEFAULT_COLOR = 0xc8c8c8;

interface MobVisual {
  group: THREE.Group;
  bodyMat: THREE.MeshBasicMaterial;
  headMat: THREE.MeshBasicMaterial;
  headMesh: THREE.Mesh;
  hpBar: THREE.Sprite;
  hpMat: THREE.SpriteMaterial;
  lastHpRatio: number;
  nameSprite: THREE.Sprite;
  nameMat: THREE.SpriteMaterial;
}

function makeNameTexture(label: string): THREE.CanvasTexture {
  const w = 128;
  const h = 24;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, w, h);
    ctx.font = '700 14px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, h / 2);
  }
  return new THREE.CanvasTexture(c);
}

function makeHpBarTexture(ratio: number): THREE.CanvasTexture {
  const w = 64;
  const h = 8;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#300';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f33';
    ctx.fillRect(0, 0, Math.round(w * Math.max(0, Math.min(1, ratio))), h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, 1);
    ctx.fillRect(0, h - 1, w, 1);
  }
  return new THREE.CanvasTexture(c);
}

export class MobRenderer {
  readonly group = new THREE.Group();
  private readonly visuals = new Map<number, MobVisual>();
  private readonly bodyGeoms = new Map<MobKind, THREE.BoxGeometry>();
  private readonly headGeoms = new Map<MobKind, THREE.BoxGeometry>();
  showNameplates = true;

  constructor() {
    this.group.name = 'webmc-mob-group';
  }

  private bodyGeomFor(mob: Mob): THREE.BoxGeometry {
    const existing = this.bodyGeoms.get(mob.def.kind);
    if (existing) return existing;
    const bx = mob.def.aabb.halfX * 2;
    const by = mob.def.aabb.halfY * 2 * 0.7;
    const bz = mob.def.aabb.halfZ * 2;
    const g = new THREE.BoxGeometry(bx, by, bz);
    this.bodyGeoms.set(mob.def.kind, g);
    return g;
  }

  private headGeomFor(mob: Mob): THREE.BoxGeometry {
    const existing = this.headGeoms.get(mob.def.kind);
    if (existing) return existing;
    const size = Math.min(mob.def.aabb.halfX, mob.def.aabb.halfZ) * 1.6;
    const g = new THREE.BoxGeometry(size, size, size);
    this.headGeoms.set(mob.def.kind, g);
    return g;
  }

  sync(mobs: IterableIterator<Mob>, cameraPos?: { x: number; y: number; z: number }): void {
    const seen = new Set<number>();
    for (const mob of mobs) {
      seen.add(mob.id);
      let vis = this.visuals.get(mob.id);
      if (!vis) {
        const color = COLORS[mob.def.kind] ?? DEFAULT_COLOR;
        const bodyMat = new THREE.MeshBasicMaterial({ color });
        const headMat = new THREE.MeshBasicMaterial({ color });
        const group = new THREE.Group();
        group.name = `mob-${String(mob.id)}`;
        const body = new THREE.Mesh(this.bodyGeomFor(mob), bodyMat);
        body.position.y = -mob.def.aabb.halfY * 0.3;
        group.add(body);
        const head = new THREE.Mesh(this.headGeomFor(mob), headMat);
        const headOffset = mob.def.aabb.halfY * 0.9;
        const headFront = mob.def.aabb.halfZ * 0.7;
        head.position.set(0, headOffset, -headFront);
        group.add(head);
        const hpMat = new THREE.SpriteMaterial({
          map: makeHpBarTexture(1),
          transparent: true,
          depthTest: true,
          depthWrite: false,
          opacity: 0,
        });
        const hpBar = new THREE.Sprite(hpMat);
        hpBar.scale.set(1.2, 0.15, 1);
        hpBar.position.set(0, mob.def.aabb.halfY + 0.6, 0);
        group.add(hpBar);
        const nameMat = new THREE.SpriteMaterial({
          map: makeNameTexture(mob.def.kind),
          transparent: true,
          depthTest: false,
          depthWrite: false,
          opacity: 0.9,
        });
        const nameSprite = new THREE.Sprite(nameMat);
        nameSprite.scale.set(0.7, 0.13, 1);
        nameSprite.position.set(0, mob.def.aabb.halfY + 0.95, 0);
        group.add(nameSprite);
        const visual: MobVisual = { group, bodyMat, headMat, headMesh: head, hpBar, hpMat, lastHpRatio: 1, nameSprite, nameMat };
        this.visuals.set(mob.id, visual);
        this.group.add(group);
        vis = visual;
      }
      vis.group.position.set(mob.position.x, mob.position.y, mob.position.z);
      vis.group.rotation.y = mob.yaw;
      if (mob.dyingSec > 0) {
        const s = mob.dyingSec / 0.35;
        vis.group.scale.setScalar(Math.max(0.01, s));
        vis.group.rotation.z = (1 - s) * Math.PI * 0.6;
        vis.group.rotation.x = 0;
      } else {
        vis.group.scale.setScalar(1);
        vis.group.rotation.z = 0;
        // Walk bob: lean forward/back based on horizontal velocity magnitude.
        const vh = Math.hypot(mob.velocity.x, mob.velocity.z);
        if (vh > 0.3) {
          const phase = performance.now() * 0.012 + mob.id * 0.37;
          vis.group.rotation.x = Math.sin(phase) * 0.08 * Math.min(1, vh / 3);
        } else {
          vis.group.rotation.x = 0;
        }
      }
      if (mob.hurtFlashSec > 0) {
        const base = COLORS[mob.def.kind] ?? DEFAULT_COLOR;
        const r = ((base >> 16) & 0xff) / 255;
        const g = ((base >> 8) & 0xff) / 255;
        const b = (base & 0xff) / 255;
        const k = Math.min(1, mob.hurtFlashSec / 0.18);
        const rr = r * (1 - k) + 1 * k;
        const gg = g * (1 - k) + 0.2 * k;
        const bb = b * (1 - k) + 0.2 * k;
        vis.bodyMat.color.setRGB(rr, gg, bb);
        vis.headMat.color.setRGB(rr, gg, bb);
      } else if (mob.def.behavior === 'creeper' && mob.fuseSec > 0) {
        // Creeper fuse: pulse white as it primes (faster as fuse approaches 1.5).
        const phase = (1 - Math.min(1, mob.fuseSec / 1.5));
        const k = (Math.sin(performance.now() * (0.012 + phase * 0.04)) * 0.5 + 0.5) * (0.4 + phase * 0.6);
        const base = COLORS['creeper'] ?? DEFAULT_COLOR;
        const r = ((base >> 16) & 0xff) / 255;
        const g = ((base >> 8) & 0xff) / 255;
        const b = (base & 0xff) / 255;
        vis.bodyMat.color.setRGB(r * (1 - k) + k, g * (1 - k) + k, b * (1 - k) + k);
        vis.headMat.color.setRGB(r * (1 - k) + k, g * (1 - k) + k, b * (1 - k) + k);
      } else {
        const c = COLORS[mob.def.kind] ?? DEFAULT_COLOR;
        vis.bodyMat.color.setHex(c);
        vis.headMat.color.setHex(c);
      }

      // Distance-aware nameplate visibility: fade past 28 blocks, hide past 64.
      if (this.showNameplates && cameraPos) {
        const dx = mob.position.x - cameraPos.x;
        const dy = mob.position.y - cameraPos.y;
        const dz = mob.position.z - cameraPos.z;
        const dist = Math.hypot(dx, dy, dz);
        if (dist > 64) {
          vis.nameSprite.visible = false;
        } else {
          vis.nameSprite.visible = true;
          const fade = dist > 28 ? Math.max(0, 1 - (dist - 28) / 36) : 1;
          vis.nameMat.opacity = 0.9 * fade;
        }
      } else {
        vis.nameSprite.visible = this.showNameplates;
      }
      const hpRatio = Math.max(0, mob.health / mob.def.maxHealth);
      const showBar = hpRatio < 1 && mob.dyingSec === 0;
      if (showBar) {
        if (Math.abs(vis.lastHpRatio - hpRatio) > 0.02 || vis.hpMat.opacity === 0) {
          if (vis.hpMat.map) vis.hpMat.map.dispose();
          vis.hpMat.map = makeHpBarTexture(hpRatio);
          vis.lastHpRatio = hpRatio;
        }
        vis.hpMat.opacity = 0.92;
      } else {
        vis.hpMat.opacity = 0;
      }
    }
    for (const [id, vis] of this.visuals) {
      if (seen.has(id)) continue;
      vis.bodyMat.dispose();
      vis.headMat.dispose();
      vis.hpMat.map?.dispose();
      vis.hpMat.dispose();
      vis.nameMat.map?.dispose();
      vis.nameMat.dispose();
      this.group.remove(vis.group);
      this.visuals.delete(id);
    }
  }

  clear(): void {
    for (const vis of this.visuals.values()) {
      vis.bodyMat.dispose();
      vis.headMat.dispose();
      vis.hpMat.map?.dispose();
      vis.hpMat.dispose();
      vis.nameMat.map?.dispose();
      vis.nameMat.dispose();
      this.group.remove(vis.group);
    }
    this.visuals.clear();
    for (const g of this.bodyGeoms.values()) g.dispose();
    for (const g of this.headGeoms.values()) g.dispose();
    this.bodyGeoms.clear();
    this.headGeoms.clear();
  }

  get count(): number {
    return this.visuals.size;
  }
}
