import { describe, it, expect } from 'vitest';
import { spawn, tick, contains } from './lingering_cloud';

describe('lingering cloud', () => {
  it('spawns at given radius', () => {
    expect(spawn(3, 600).radius).toBe(3);
  });

  it('shrinks over time', () => {
    let c = spawn(3, 600);
    for (let i = 0; i < 100; i++) {
      const n = tick(c);
      if (!n) break;
      c = n;
    }
    expect(c.radius).toBeLessThan(3);
  });

  it('expires', () => {
    let c: ReturnType<typeof spawn> | null = spawn(3, 10);
    for (let i = 0; i < 20; i++) {
      if (!c) break;
      c = tick(c);
    }
    expect(c).toBeNull();
  });

  it('contains check', () => {
    const c = spawn(5, 600);
    expect(contains(c, 1, 1)).toBe(true);
    expect(contains(c, 10, 0)).toBe(false);
  });
});
