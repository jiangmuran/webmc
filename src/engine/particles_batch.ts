// Particle batching. Instanced quads keyed by texture+blend. Each
// particle has position/velocity/age/maxAge/size. Dead particles are
// swept from the list.

export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  age: number;
  maxAge: number;
  size: number;
  textureId: number;
}

export interface ParticleSystem {
  particles: Particle[];
  gravity: number;
}

export const DEFAULT_GRAVITY = -0.04;

export function makeSystem(gravity = DEFAULT_GRAVITY): ParticleSystem {
  return { particles: [], gravity };
}

export function emit(s: ParticleSystem, p: Particle): void {
  s.particles.push(p);
}

export function tick(s: ParticleSystem, dt: number): void {
  const alive: Particle[] = [];
  for (const p of s.particles) {
    p.age += dt;
    if (p.age >= p.maxAge) continue;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.z += p.vz * dt;
    p.vy += s.gravity * dt;
    alive.push(p);
  }
  s.particles = alive;
}

export function activeCount(s: ParticleSystem): number {
  return s.particles.length;
}

export function batchesByTexture(s: ParticleSystem): Map<number, Particle[]> {
  const m = new Map<number, Particle[]>();
  for (const p of s.particles) {
    const arr = m.get(p.textureId) ?? [];
    arr.push(p);
    m.set(p.textureId, arr);
  }
  return m;
}
