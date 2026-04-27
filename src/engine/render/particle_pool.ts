// Particle instance pool. A fixed-size ring of particle slots, recycled
// when the oldest slots expire. Scaling per the "particles" setting:
//   'all': full pool
//   'decreased': half
//   'minimal': 10%

export type ParticleSetting = 'all' | 'decreased' | 'minimal';

export interface ParticleInstance {
  kind: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  ageSec: number;
  lifeSec: number;
  colorRGBA: number;
  size: number;
  active: boolean;
}

export interface PoolOptions {
  baseCapacity: number;
  setting: ParticleSetting;
}

function capacityFor(opts: PoolOptions): number {
  switch (opts.setting) {
    case 'all':
      return opts.baseCapacity;
    case 'decreased':
      return Math.floor(opts.baseCapacity / 2);
    case 'minimal':
      return Math.floor(opts.baseCapacity / 10);
  }
}

export class ParticlePool {
  private readonly instances: ParticleInstance[];
  private cursor = 0;

  constructor(opts: PoolOptions) {
    const cap = capacityFor(opts);
    this.instances = Array.from({ length: cap }, () => ({
      kind: '',
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      ageSec: 0,
      lifeSec: 0,
      colorRGBA: 0,
      size: 0,
      active: false,
    }));
  }

  spawn(spec: Omit<ParticleInstance, 'active' | 'ageSec'>): ParticleInstance | null {
    if (this.instances.length === 0) return null;
    let slot = this.instances[this.cursor];
    const start = this.cursor;
    let tries = 0;
    while (slot?.active && tries < this.instances.length) {
      this.cursor = (this.cursor + 1) % this.instances.length;
      slot = this.instances[this.cursor];
      tries++;
    }
    slot = this.instances[this.cursor];
    if (!slot) return null;
    // Explicit field writes — was Object.assign with a fresh
    // {ageSec, active} literal per spawn. Pool spawn fires per particle
    // emission (block break / explosion / weather), so churn matters.
    slot.kind = spec.kind;
    slot.x = spec.x;
    slot.y = spec.y;
    slot.z = spec.z;
    slot.vx = spec.vx;
    slot.vy = spec.vy;
    slot.vz = spec.vz;
    slot.lifeSec = spec.lifeSec;
    slot.colorRGBA = spec.colorRGBA;
    slot.size = spec.size;
    slot.ageSec = 0;
    slot.active = true;
    this.cursor = (this.cursor + 1) % this.instances.length;
    void start;
    return slot;
  }

  tick(dtSec: number): void {
    for (const p of this.instances) {
      if (!p.active) continue;
      p.ageSec += dtSec;
      p.x += p.vx * dtSec;
      p.y += p.vy * dtSec;
      p.z += p.vz * dtSec;
      if (p.ageSec >= p.lifeSec) p.active = false;
    }
  }

  get activeCount(): number {
    let n = 0;
    for (const p of this.instances) if (p.active) n++;
    return n;
  }

  get capacity(): number {
    return this.instances.length;
  }

  forEach(fn: (p: ParticleInstance) => void): void {
    for (const p of this.instances) if (p.active) fn(p);
  }
}
