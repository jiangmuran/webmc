import { describe, it, expect } from 'vitest';
import { ParticlePool } from './particle_pool';

function spec(
  overrides: Partial<Parameters<ParticlePool['spawn']>[0]> = {},
): Parameters<ParticlePool['spawn']>[0] {
  return {
    kind: 'smoke',
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0.1,
    vz: 0,
    lifeSec: 1,
    colorRGBA: 0xffffffff,
    size: 1,
    ...overrides,
  };
}

describe('particle pool', () => {
  it('all setting = full capacity', () => {
    const p = new ParticlePool({ baseCapacity: 1000, setting: 'all' });
    expect(p.capacity).toBe(1000);
  });

  it('decreased = half', () => {
    const p = new ParticlePool({ baseCapacity: 1000, setting: 'decreased' });
    expect(p.capacity).toBe(500);
  });

  it('minimal = 10%', () => {
    const p = new ParticlePool({ baseCapacity: 1000, setting: 'minimal' });
    expect(p.capacity).toBe(100);
  });

  it('spawn + tick + expiry', () => {
    const p = new ParticlePool({ baseCapacity: 10, setting: 'all' });
    p.spawn(spec({ lifeSec: 0.1 }));
    expect(p.activeCount).toBe(1);
    p.tick(1);
    expect(p.activeCount).toBe(0);
  });

  it('spawn advances cursor + recycles', () => {
    const p = new ParticlePool({ baseCapacity: 2, setting: 'all' });
    p.spawn(spec({ lifeSec: 10 }));
    p.spawn(spec({ lifeSec: 10 }));
    expect(p.activeCount).toBe(2);
    p.tick(20);
    p.spawn(spec({ lifeSec: 5 }));
    expect(p.activeCount).toBe(1);
  });

  it('forEach visits actives', () => {
    const p = new ParticlePool({ baseCapacity: 5, setting: 'all' });
    p.spawn(spec({ x: 1 }));
    p.spawn(spec({ x: 2 }));
    const xs: number[] = [];
    p.forEach((pt) => xs.push(pt.x));
    expect(xs).toEqual([1, 2]);
  });
});
