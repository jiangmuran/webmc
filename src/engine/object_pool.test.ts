import { describe, it, expect } from 'vitest';
import { makePool, acquire, release, totalCapacity } from './object_pool';

interface Vec {
  x: number;
  y: number;
  z: number;
}

describe('object pool', () => {
  it('acquire from factory', () => {
    const p = makePool<Vec>(
      () => ({ x: 0, y: 0, z: 0 }),
      (v) => {
        v.x = 0;
        v.y = 0;
        v.z = 0;
      },
    );
    const v = acquire(p);
    expect(v).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('release reuses', () => {
    const p = makePool<Vec>(
      () => ({ x: 0, y: 0, z: 0 }),
      (v) => {
        v.x = 0;
        v.y = 0;
        v.z = 0;
      },
    );
    const v = acquire(p);
    v.x = 99;
    release(p, v);
    const v2 = acquire(p);
    expect(v2).toBe(v);
    expect(v2.x).toBe(0);
  });

  it('prefill avoids factory', () => {
    let calls = 0;
    const p = makePool<Vec>(
      () => {
        calls++;
        return { x: 0, y: 0, z: 0 };
      },
      () => undefined,
      5,
    );
    acquire(p);
    expect(calls).toBe(5);
  });

  it('capacity tracks in-use + free', () => {
    const p = makePool<Vec>(
      () => ({ x: 0, y: 0, z: 0 }),
      () => undefined,
      3,
    );
    acquire(p);
    acquire(p);
    expect(totalCapacity(p)).toBe(3);
  });
});
