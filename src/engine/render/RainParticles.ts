import * as THREE from 'three';

export interface RainOptions {
  maxParticles: number;
  spawnRadius: number;
  fallSpeed: number;
  height: number;
  color: number;
}

const DEFAULTS: RainOptions = {
  maxParticles: 1200,
  spawnRadius: 18,
  fallSpeed: 26,
  height: 16,
  color: 0xa0c6ff,
};

export class RainParticles {
  readonly group: THREE.Points;
  private active = false;
  private readonly opts: RainOptions;
  private readonly positions: Float32Array;
  // Cached BufferAttribute ref. update() called geometry.getAttribute
  // + instanceof per frame; attribute is set once at construction and
  // never replaced.
  private readonly positionAttr: THREE.BufferAttribute;

  constructor(opts: Partial<RainOptions> = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    const count = this.opts.maxParticles;
    this.positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) this.respawn(i, Math.random() * this.opts.height);
    const geom = new THREE.BufferGeometry();
    this.positionAttr = new THREE.BufferAttribute(this.positions, 3);
    geom.setAttribute('position', this.positionAttr);
    const mat = new THREE.PointsMaterial({
      color: this.opts.color,
      size: 0.25,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    this.group = new THREE.Points(geom, mat);
    this.group.frustumCulled = false;
    this.group.visible = false;
  }

  setActive(on: boolean): void {
    this.active = on;
    this.group.visible = on;
  }

  setKind(kind: 'rain' | 'snow'): void {
    if (kind === 'snow') {
      this.opts.color = 0xffffff;
      this.opts.fallSpeed = 1.5;
    } else {
      this.opts.color = 0xa0c6ff;
      this.opts.fallSpeed = 26;
    }
    const mat = this.group.material as THREE.PointsMaterial;
    mat.color.setHex(this.opts.color);
    mat.size = kind === 'snow' ? 0.4 : 0.25;
    mat.needsUpdate = true;
  }

  isActive(): boolean {
    return this.active;
  }

  update(dtSec: number, centerX: number, centerY: number, centerZ: number): void {
    if (!this.active) return;
    const count = this.opts.maxParticles;
    const step = this.opts.fallSpeed * dtSec;
    const y0 = centerY + this.opts.height;
    for (let i = 0; i < count; i++) {
      const base = i * 3;
      this.positions[base + 1]! -= step;
      if (this.positions[base + 1]! < centerY - 2) {
        this.positions[base] = centerX + (Math.random() - 0.5) * this.opts.spawnRadius * 2;
        this.positions[base + 1] = y0;
        this.positions[base + 2] = centerZ + (Math.random() - 0.5) * this.opts.spawnRadius * 2;
      }
    }
    this.positionAttr.needsUpdate = true;
  }

  private respawn(i: number, existingY: number): void {
    const base = i * 3;
    this.positions[base] = (Math.random() - 0.5) * this.opts.spawnRadius * 2;
    this.positions[base + 1] = existingY;
    this.positions[base + 2] = (Math.random() - 0.5) * this.opts.spawnRadius * 2;
  }
}
