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
  witch: 0x3a3144,
  mooshroom: 0xa12a1e,
  donkey: 0x6b563f,
  mule: 0x4a3826,
  salmon: 0xd06a4a,
  cod: 0xc4a06a,
  pufferfish: 0xeed060,
  tropical_fish: 0xff8040,
  silverfish: 0x707070,
  cave_spider: 0x1a4a5a,
  sniffer: 0x5a8a40,
  armadillo: 0xa68868,
  bat: 0x402a18,
  allay: 0x66c0e0,
  villager: 0x9b6a4a,
  zombie_villager: 0x4a7a4d,
  wither: 0x222226,
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
  // -1 = unknown / dirty (force a re-set). Otherwise the last "normal"
  // hex applied. Used to skip setHex(c) every frame when the color
  // didn't change — mobs spend most of their life in non-hurt,
  // non-fusing state and a constant-color setHex still writes through
  // three.js's material color and flags the material dirty.
  lastNormalColorHex: number;
  // True when the previous frame applied a hurt-flash / fuse-pulse
  // tint, so the next "normal" frame must force a re-set even if the
  // base palette color hasn't changed.
  needsColorRestore: boolean;
  // Cached transform values — three.js Euler fires _onChangeCallback
  // (quaternion.setFromEuler — 6 trig + multiple muls) on every per-
  // axis set, so writing rotation.x=0 + rotation.y=yaw + rotation.z=0
  // fires the recompute three times per mob per frame even when the
  // values didn't change. Diff-skip the whole rotation via .set().
  lastRotX: number;
  lastRotY: number;
  lastRotZ: number;
  lastScale: number;
  // Pre-resolved base color hex for this mob's kind. Kind never
  // changes after construction, so we can skip the per-frame
  // `COLORS[kind] ?? DEFAULT_COLOR` Record lookup + fallback in the
  // hurt-flash, creeper-fuse, and normal-restore paths. Saves ~50
  // (mobs) × 60 (Hz) = 3000 string-keyed lookups/sec at busy worlds.
  kindBaseHex: number;
  // Diff-cache for the nameplate opacity. Mobs within 28 blocks all
  // write 0.9 every frame; the SpriteMaterial setter still flags the
  // material dirty even when the value is identical. -1 is the
  // "force first set" sentinel.
  lastNameOpacity: number;
}

// Cache by label string. Mob nameplates with the same name (e.g.
// every 'zombie') were each getting a fresh canvas + texture. With
// ~70 mob kinds + custom names this caps the texture count to the
// number of unique labels (~80) rather than mob count (~200).
const nameTextureCache = new Map<string, THREE.CanvasTexture>();
function makeNameTexture(label: string): THREE.CanvasTexture {
  const cached = nameTextureCache.get(label);
  if (cached) return cached;
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
  const tex = new THREE.CanvasTexture(c);
  nameTextureCache.set(label, tex);
  return tex;
}

// Texture cache keyed by 21-bucket ratio (0%, 5%, 10%, ..., 100%). Was
// creating + disposing a CanvasTexture per mob per damage event — 50
// damaged mobs taking damage each tick allocated 50 textures/sec. Now
// shared: at most 21 textures total, never disposed.
const HP_BAR_BUCKETS = 21;
const hpBarTextureCache = new Map<number, THREE.CanvasTexture>();
function makeHpBarTexture(ratio: number): THREE.CanvasTexture {
  const r = Math.max(0, Math.min(1, ratio));
  const bucket = Math.round(r * (HP_BAR_BUCKETS - 1));
  const cached = hpBarTextureCache.get(bucket);
  if (cached) return cached;
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
    ctx.fillRect(0, 0, Math.round((w * bucket) / (HP_BAR_BUCKETS - 1)), h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, 1);
    ctx.fillRect(0, h - 1, w, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  hpBarTextureCache.set(bucket, tex);
  return tex;
}

export class MobRenderer {
  readonly group = new THREE.Group();
  private readonly visuals = new Map<number, MobVisual>();
  private readonly bodyGeoms = new Map<MobKind, THREE.BoxGeometry>();
  private readonly headGeoms = new Map<MobKind, THREE.BoxGeometry>();
  private readonly customNames = new Map<number, string>();
  private readonly customScales = new Map<number, number>();
  // Reused 'seen this frame' scratch set — was allocated per sync().
  private readonly seenScratch = new Set<number>();

  setMobScale(mobId: number, scale: number): void {
    if (Math.abs(scale - 1) < 0.001) this.customScales.delete(mobId);
    else this.customScales.set(mobId, scale);
  }
  showNameplates = true;

  setMobName(mobId: number, name: string): void {
    this.customNames.set(mobId, name);
    const vis = this.visuals.get(mobId);
    if (vis) {
      // Don't dispose the previous map — it's shared from the cache.
      vis.nameMat.map = makeNameTexture(name);
      vis.nameMat.needsUpdate = true;
    }
  }

  constructor() {
    this.group.name = 'webmc-mob-group';
    // Group sits at world origin; per-mob visuals carry their own
    // positions. Skip three.js's per-frame group matrix update.
    this.group.matrixAutoUpdate = false;
    this.group.updateMatrix();
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
    const seen = this.seenScratch;
    seen.clear();
    // Hoist per-frame time + creeper-fuse phase basis. Was calling
    // performance.now() per mob inside the per-mob loop.
    const nowMs = performance.now();
    for (const mob of mobs) {
      seen.add(mob.id);
      // LOD culling: hide mob group entirely past 96 blocks (still tracked, just not rendered).
      // Cache distSq for the nameplate-fade block below — was
      // recomputing dx/dy/dz + Math.hypot once more per mob per frame.
      let cDistSq = -1;
      if (cameraPos) {
        const cdx = mob.position.x - cameraPos.x;
        const cdy = mob.position.y - cameraPos.y;
        const cdz = mob.position.z - cameraPos.z;
        cDistSq = cdx * cdx + cdy * cdy + cdz * cdz;
        if (cDistSq > 96 * 96) {
          const v = this.visuals.get(mob.id);
          // Skip the visible=false write when already hidden — three.js
          // setter triggers matrix-update flagging and per-frame writes
          // for nothing add up at high mob count.
          if (v?.group.visible) v.group.visible = false;
          continue;
        }
      }
      let vis = this.visuals.get(mob.id);
      if (vis && !vis.group.visible) vis.group.visible = true;
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
        const nameLabel = this.customNames.get(mob.id) ?? mob.def.kind;
        const nameMat = new THREE.SpriteMaterial({
          map: makeNameTexture(nameLabel),
          transparent: true,
          depthTest: false,
          depthWrite: false,
          opacity: 0.9,
        });
        const nameSprite = new THREE.Sprite(nameMat);
        nameSprite.scale.set(0.7, 0.13, 1);
        nameSprite.position.set(0, mob.def.aabb.halfY + 0.95, 0);
        group.add(nameSprite);
        const visual: MobVisual = {
          group,
          bodyMat,
          headMat,
          headMesh: head,
          hpBar,
          hpMat,
          lastHpRatio: 1,
          nameSprite,
          nameMat,
          lastNormalColorHex: color,
          needsColorRestore: false,
          lastRotX: 0,
          lastRotY: 0,
          lastRotZ: 0,
          lastScale: 1,
          kindBaseHex: color,
          lastNameOpacity: 0.9,
        };
        this.visuals.set(mob.id, visual);
        this.group.add(group);
        vis = visual;
      }
      vis.group.position.set(mob.position.x, mob.position.y, mob.position.z);
      let targetRotX: number;
      let targetRotZ: number;
      let targetScale: number;
      if (mob.dyingSec > 0) {
        const s = mob.dyingSec / 0.35;
        targetScale = Math.max(0.01, s);
        targetRotZ = (1 - s) * Math.PI * 0.6;
        targetRotX = 0;
      } else {
        targetScale = this.customScales.get(mob.id) ?? 1;
        targetRotZ = 0;
        const vh = Math.hypot(mob.velocity.x, mob.velocity.z);
        if (vh > 0.3) {
          const phase = nowMs * 0.012 + mob.id * 0.37;
          targetRotX = Math.sin(phase) * 0.08 * Math.min(1, vh / 3);
        } else {
          targetRotX = 0;
        }
      }
      if (vis.lastScale !== targetScale) {
        vis.group.scale.setScalar(targetScale);
        vis.lastScale = targetScale;
      }
      const targetRotY = mob.yaw;
      if (
        vis.lastRotX !== targetRotX ||
        vis.lastRotY !== targetRotY ||
        vis.lastRotZ !== targetRotZ
      ) {
        vis.group.rotation.set(targetRotX, targetRotY, targetRotZ);
        vis.lastRotX = targetRotX;
        vis.lastRotY = targetRotY;
        vis.lastRotZ = targetRotZ;
      }
      if (mob.hurtFlashSec > 0) {
        const base = vis.kindBaseHex;
        const r = ((base >> 16) & 0xff) / 255;
        const g = ((base >> 8) & 0xff) / 255;
        const b = (base & 0xff) / 255;
        const k = Math.min(1, mob.hurtFlashSec / 0.18);
        const rr = r * (1 - k) + 1 * k;
        const gg = g * (1 - k) + 0.2 * k;
        const bb = b * (1 - k) + 0.2 * k;
        vis.bodyMat.color.setRGB(rr, gg, bb);
        vis.headMat.color.setRGB(rr, gg, bb);
        vis.needsColorRestore = true;
      } else if (mob.def.behavior === 'creeper' && mob.fuseSec > 0) {
        // Creeper fuse: pulse white as it primes (faster as fuse approaches 1.5).
        const phase = 1 - Math.min(1, mob.fuseSec / 1.5);
        const k = (Math.sin(nowMs * (0.012 + phase * 0.04)) * 0.5 + 0.5) * (0.4 + phase * 0.6);
        // creeper visuals are guaranteed to be a creeper kind, so
        // kindBaseHex is the same as COLORS['creeper'].
        const base = vis.kindBaseHex;
        const r = ((base >> 16) & 0xff) / 255;
        const g = ((base >> 8) & 0xff) / 255;
        const b = (base & 0xff) / 255;
        vis.bodyMat.color.setRGB(r * (1 - k) + k, g * (1 - k) + k, b * (1 - k) + k);
        vis.headMat.color.setRGB(r * (1 - k) + k, g * (1 - k) + k, b * (1 - k) + k);
        vis.needsColorRestore = true;
      } else {
        // Normal palette color. Mobs spend most of their life in this
        // state, so skip the setHex (which still writes through the
        // material color and flags it dirty) when nothing changed.
        const c = vis.kindBaseHex;
        if (vis.needsColorRestore || vis.lastNormalColorHex !== c) {
          vis.bodyMat.color.setHex(c);
          vis.headMat.color.setHex(c);
          vis.lastNormalColorHex = c;
          vis.needsColorRestore = false;
        }
      }

      // Distance-aware nameplate visibility: fade past 28 blocks, hide past 64.
      if (this.showNameplates && cameraPos) {
        // Reuse the LOD distSq above instead of recomputing dx/dy/dz +
        // sqrt for every mob. Compare against squared cutoffs first so
        // we only sqrt for mobs in the fade band.
        if (cDistSq > 64 * 64) {
          if (vis.nameSprite.visible) vis.nameSprite.visible = false;
        } else {
          if (!vis.nameSprite.visible) vis.nameSprite.visible = true;
          let targetOpacity: number;
          if (cDistSq > 28 * 28) {
            const dist = Math.sqrt(cDistSq);
            targetOpacity = 0.9 * Math.max(0, 1 - (dist - 28) / 36);
          } else {
            targetOpacity = 0.9;
          }
          if (vis.lastNameOpacity !== targetOpacity) {
            vis.nameMat.opacity = targetOpacity;
            vis.lastNameOpacity = targetOpacity;
          }
        }
      } else {
        vis.nameSprite.visible = this.showNameplates;
      }
      const hpRatio = Math.max(0, mob.health / mob.def.maxHealth);
      const showBar = hpRatio < 1 && mob.dyingSec === 0;
      if (showBar) {
        if (Math.abs(vis.lastHpRatio - hpRatio) > 0.02 || vis.hpMat.opacity === 0) {
          // Don't dispose old map — it's shared from the bucket cache.
          vis.hpMat.map = makeHpBarTexture(hpRatio);
          vis.lastHpRatio = hpRatio;
        }
        // Diff-cache opacity — was writing 0.92 every frame for every
        // damaged mob even when the bar was already shown.
        if (vis.hpMat.opacity !== 0.92) vis.hpMat.opacity = 0.92;
      } else if (vis.hpMat.opacity !== 0) {
        vis.hpMat.opacity = 0;
      }
    }
    for (const [id, vis] of this.visuals) {
      if (seen.has(id)) continue;
      vis.bodyMat.dispose();
      vis.headMat.dispose();
      // hpMat.map is shared (bucket cache) — don't dispose here.
      vis.hpMat.dispose();
      // nameMat.map is shared (label cache) — don't dispose.
      vis.nameMat.dispose();
      this.group.remove(vis.group);
      this.visuals.delete(id);
      this.customNames.delete(id);
      this.customScales.delete(id);
    }
  }

  clear(): void {
    for (const vis of this.visuals.values()) {
      vis.bodyMat.dispose();
      vis.headMat.dispose();
      // hpMat.map is shared (bucket cache) — don't dispose.
      vis.hpMat.dispose();
      // nameMat.map is shared (label cache) — don't dispose.
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
