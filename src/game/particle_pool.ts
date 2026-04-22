// Particle pool for visual effects. Fixed-size pool: spawn replaces
// oldest when full. Positions + velocities + age tracked in
// SoA arrays for SIMD-friendly update.

export class ParticlePool {
  readonly capacity: number;
  readonly x: Float32Array;
  readonly y: Float32Array;
  readonly z: Float32Array;
  readonly vx: Float32Array;
  readonly vy: Float32Array;
  readonly vz: Float32Array;
  readonly age: Float32Array;
  readonly maxAge: Float32Array;
  readonly alive: Uint8Array;
  private nextSlot = 0;

  constructor(capacity = 2000) {
    this.capacity = capacity;
    this.x = new Float32Array(capacity);
    this.y = new Float32Array(capacity);
    this.z = new Float32Array(capacity);
    this.vx = new Float32Array(capacity);
    this.vy = new Float32Array(capacity);
    this.vz = new Float32Array(capacity);
    this.age = new Float32Array(capacity);
    this.maxAge = new Float32Array(capacity);
    this.alive = new Uint8Array(capacity);
  }

  spawn(
    px: number,
    py: number,
    pz: number,
    vx: number,
    vy: number,
    vz: number,
    maxAge: number,
  ): number {
    let slot = -1;
    for (let i = 0; i < this.capacity; i++) {
      const s = (this.nextSlot + i) % this.capacity;
      if (this.alive[s] === 0) {
        slot = s;
        break;
      }
    }
    if (slot === -1) slot = this.nextSlot;
    this.nextSlot = (slot + 1) % this.capacity;
    this.x[slot] = px;
    this.y[slot] = py;
    this.z[slot] = pz;
    this.vx[slot] = vx;
    this.vy[slot] = vy;
    this.vz[slot] = vz;
    this.age[slot] = 0;
    this.maxAge[slot] = maxAge;
    this.alive[slot] = 1;
    return slot;
  }

  tick(deltaSec: number): void {
    const n = this.capacity;
    for (let i = 0; i < n; i++) {
      if (this.alive[i] === 0) continue;
      const curAge = (this.age[i] ?? 0) + deltaSec;
      const max = this.maxAge[i] ?? 0;
      if (curAge >= max) {
        this.alive[i] = 0;
        continue;
      }
      this.age[i] = curAge;
      this.x[i] = (this.x[i] ?? 0) + (this.vx[i] ?? 0) * deltaSec;
      this.y[i] = (this.y[i] ?? 0) + (this.vy[i] ?? 0) * deltaSec;
      this.z[i] = (this.z[i] ?? 0) + (this.vz[i] ?? 0) * deltaSec;
      this.vy[i] = (this.vy[i] ?? 0) - 9.8 * deltaSec * 0.1;
    }
  }

  liveCount(): number {
    let n = 0;
    for (let i = 0; i < this.capacity; i++) if (this.alive[i]) n += 1;
    return n;
  }
}
