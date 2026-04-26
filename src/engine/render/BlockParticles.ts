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
  // Pool of dead particle objects for reuse. emit was allocating
  // 8..18 fresh Particles per call; mining a vein of stone or a TNT
  // burst can churn hundreds of objects per second. Particles cycle
  // through alive → pool → alive without ever being GC'd in steady
  // state. Pool is bounded by capacity so we never hold more than the
  // active particle budget would imply.
  private readonly pool: Particle[] = [];
  private readonly capacity: number;
  // Tracks how many particles flush() last wrote. When this frame's
  // count is 0 and the previous one was 0, the buffers and drawRange
  // are already zeroed — skip the setDrawRange + three needsUpdate
  // writes entirely. The common case (player not breaking blocks) hits
  // this path every frame.
  private lastFlushedCount = 0;

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

  private acquire(): Particle {
    return (
      this.pool.pop() ?? {
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        r: 0,
        g: 0,
        b: 0,
        ageSec: 0,
        lifeSec: 0,
        size: 0,
      }
    );
  }

  emitBreak(bx: number, by: number, bz: number, rgb: readonly [number, number, number]): void {
    const [r, g, b] = rgb;
    for (let i = 0; i < 18; i++) {
      if (this.alive.length >= this.capacity) break;
      const p = this.acquire();
      p.x = bx + 0.15 + Math.random() * 0.7;
      p.y = by + 0.15 + Math.random() * 0.7;
      p.z = bz + 0.15 + Math.random() * 0.7;
      p.vx = (Math.random() - 0.5) * 2.5;
      p.vy = 2.5 + Math.random() * 1.8;
      p.vz = (Math.random() - 0.5) * 2.5;
      p.r = (r / 255) * (0.78 + Math.random() * 0.22);
      p.g = (g / 255) * (0.78 + Math.random() * 0.22);
      p.b = (b / 255) * (0.78 + Math.random() * 0.22);
      p.ageSec = 0;
      p.lifeSec = 0.6 + Math.random() * 0.45;
      p.size = 0.9 + Math.random() * 0.6;
      this.alive.push(p);
    }
  }

  emitPlace(bx: number, by: number, bz: number, rgb: readonly [number, number, number]): void {
    const [r, g, b] = rgb;
    for (let i = 0; i < 8; i++) {
      if (this.alive.length >= this.capacity) break;
      const p = this.acquire();
      p.x = bx + 0.5 + (Math.random() - 0.5) * 0.9;
      p.y = by + Math.random() * 0.15;
      p.z = bz + 0.5 + (Math.random() - 0.5) * 0.9;
      p.vx = (Math.random() - 0.5) * 1.4;
      p.vy = 1.2 + Math.random() * 0.8;
      p.vz = (Math.random() - 0.5) * 1.4;
      p.r = (r / 255) * 0.85;
      p.g = (g / 255) * 0.85;
      p.b = (b / 255) * 0.85;
      p.ageSec = 0;
      p.lifeSec = 0.35 + Math.random() * 0.25;
      p.size = 0.7 + Math.random() * 0.3;
      this.alive.push(p);
    }
  }

  tick(dtSec: number): void {
    const gravity = 22;
    const drag = Math.exp(-dtSec * 3.2);
    // Swap-remove dead particles: splice(i,1) was O(N) per dead particle,
    // so heavy explosion bursts (200+ particles) cost O(N^2) per tick.
    // Swap-with-last + pop is O(1) and order doesn't matter for points.
    for (let i = this.alive.length - 1; i >= 0; i--) {
      const p = this.alive[i]!;
      p.ageSec += dtSec;
      if (p.ageSec >= p.lifeSec) {
        const last = this.alive.length - 1;
        if (i !== last) this.alive[i] = this.alive[last]!;
        this.alive.pop();
        // Recycle the dead particle for a future emit. Cap pool at
        // capacity so a one-time mega-burst doesn't bloat the pool.
        if (this.pool.length < this.capacity) this.pool.push(p);
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
    if (n === 0 && this.lastFlushedCount === 0) return;
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
    this.lastFlushedCount = n;
  }
}
