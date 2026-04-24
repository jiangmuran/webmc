import * as THREE from 'three';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  r: number;
  g: number;
  b: number;
  ageSec: number;
  lifeSec: number;
  size: number;
}

export class BlockParticles {
  readonly group: THREE.Points;
  private readonly positions: Float32Array;
  private readonly colors: Float32Array;
  private readonly sizes: Float32Array;
  private readonly alive: Particle[] = [];
  private readonly capacity: number;

  constructor(capacity = 512) {
    this.capacity = capacity;
    this.positions = new Float32Array(capacity * 3);
    this.colors = new Float32Array(capacity * 3);
    this.sizes = new Float32Array(capacity);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
    geom.setDrawRange(0, 0);
    const mat = new THREE.PointsMaterial({
      size: 0.18,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    this.group = new THREE.Points(geom, mat);
    this.group.frustumCulled = false;
  }

  emitBreak(bx: number, by: number, bz: number, rgb: readonly [number, number, number]): void {
    const [r, g, b] = rgb;
    for (let i = 0; i < 18; i++) {
      if (this.alive.length >= this.capacity) break;
      this.alive.push({
        x: bx + 0.15 + Math.random() * 0.7,
        y: by + 0.15 + Math.random() * 0.7,
        z: bz + 0.15 + Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 2.5 + Math.random() * 1.8,
        vz: (Math.random() - 0.5) * 2.5,
        r: (r / 255) * (0.78 + Math.random() * 0.22),
        g: (g / 255) * (0.78 + Math.random() * 0.22),
        b: (b / 255) * (0.78 + Math.random() * 0.22),
        ageSec: 0,
        lifeSec: 0.6 + Math.random() * 0.45,
        size: 0.9 + Math.random() * 0.6,
      });
    }
  }

  emitPlace(bx: number, by: number, bz: number, rgb: readonly [number, number, number]): void {
    const [r, g, b] = rgb;
    for (let i = 0; i < 8; i++) {
      if (this.alive.length >= this.capacity) break;
      this.alive.push({
        x: bx + 0.5 + (Math.random() - 0.5) * 0.9,
        y: by + Math.random() * 0.15,
        z: bz + 0.5 + (Math.random() - 0.5) * 0.9,
        vx: (Math.random() - 0.5) * 1.4,
        vy: 1.2 + Math.random() * 0.8,
        vz: (Math.random() - 0.5) * 1.4,
        r: (r / 255) * 0.85,
        g: (g / 255) * 0.85,
        b: (b / 255) * 0.85,
        ageSec: 0,
        lifeSec: 0.35 + Math.random() * 0.25,
        size: 0.7 + Math.random() * 0.3,
      });
    }
  }

  tick(dtSec: number): void {
    const gravity = 22;
    const drag = Math.exp(-dtSec * 3.2);
    for (let i = this.alive.length - 1; i >= 0; i--) {
      const p = this.alive[i]!;
      p.ageSec += dtSec;
      if (p.ageSec >= p.lifeSec) {
        this.alive.splice(i, 1);
        continue;
      }
      p.vy -= gravity * dtSec;
      p.vx *= drag;
      p.vz *= drag;
      p.x += p.vx * dtSec;
      p.y += p.vy * dtSec;
      p.z += p.vz * dtSec;
    }
    this.flush();
  }

  private flush(): void {
    const n = this.alive.length;
    for (let i = 0; i < n; i++) {
      const p = this.alive[i]!;
      const base = i * 3;
      this.positions[base] = p.x;
      this.positions[base + 1] = p.y;
      this.positions[base + 2] = p.z;
      this.colors[base] = p.r;
      this.colors[base + 1] = p.g;
      this.colors[base + 2] = p.b;
      this.sizes[i] = p.size;
    }
    const geom = this.group.geometry;
    geom.setDrawRange(0, n);
    const pos = geom.getAttribute('position');
    const col = geom.getAttribute('color');
    const siz = geom.getAttribute('size');
    if (pos instanceof THREE.BufferAttribute) pos.needsUpdate = true;
    if (col instanceof THREE.BufferAttribute) col.needsUpdate = true;
    if (siz instanceof THREE.BufferAttribute) siz.needsUpdate = true;
  }
}
