import { describe, it, expect } from 'vitest';
import { makeSystem, emit, tick, activeCount, batchesByTexture } from './particles_batch';

function mk(textureId = 0, maxAge = 100): Parameters<typeof emit>[1] {
  return { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, age: 0, maxAge, size: 0.1, textureId };
}

describe('particles batch', () => {
  it('emit + count', () => {
    const s = makeSystem();
    emit(s, mk());
    expect(activeCount(s)).toBe(1);
  });

  it('tick ages and sweeps', () => {
    const s = makeSystem(0);
    emit(s, mk(0, 1));
    tick(s, 0.5);
    expect(activeCount(s)).toBe(1);
    tick(s, 0.6);
    expect(activeCount(s)).toBe(0);
  });

  it('gravity accelerates vy', () => {
    const s = makeSystem(-1);
    emit(s, mk());
    tick(s, 1);
    const p = s.particles[0];
    if (!p) throw new Error('empty');
    expect(p.vy).toBeCloseTo(-1);
  });

  it('batches by texture', () => {
    const s = makeSystem();
    emit(s, mk(0));
    emit(s, mk(1));
    emit(s, mk(0));
    const b = batchesByTexture(s);
    expect(b.get(0)?.length).toBe(2);
    expect(b.get(1)?.length).toBe(1);
  });

  it('position integrates', () => {
    const s = makeSystem(0);
    emit(s, { ...mk(), vx: 1 });
    tick(s, 2);
    expect(s.particles[0]?.x).toBeCloseTo(2);
  });
});
