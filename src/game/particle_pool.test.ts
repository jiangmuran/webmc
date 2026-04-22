import { describe, it, expect } from 'vitest';
import { ParticlePool } from './particle_pool';

describe('particle pool', () => {
  it('spawn increments live count', () => {
    const p = new ParticlePool(10);
    p.spawn(0, 0, 0, 1, 1, 1, 1);
    expect(p.liveCount()).toBe(1);
  });

  it('tick ages and kills', () => {
    const p = new ParticlePool(10);
    const s = p.spawn(0, 0, 0, 0, 0, 0, 0.5);
    p.tick(1.0);
    expect(p.alive[s]).toBe(0);
    expect(p.liveCount()).toBe(0);
  });

  it('velocity updates position', () => {
    const p = new ParticlePool(10);
    const s = p.spawn(0, 0, 0, 1, 0, 0, 10);
    p.tick(0.5);
    expect(p.x[s]).toBeCloseTo(0.5);
  });

  it('overflow reuses slot', () => {
    const p = new ParticlePool(3);
    for (let i = 0; i < 5; i++) p.spawn(0, 0, 0, 0, 0, 0, 100);
    expect(p.liveCount()).toBe(3);
  });

  it('gravity pulls down', () => {
    const p = new ParticlePool(5);
    const s = p.spawn(0, 10, 0, 0, 0, 0, 100);
    p.tick(1);
    expect(p.vy[s]).toBeLessThan(0);
  });
});
