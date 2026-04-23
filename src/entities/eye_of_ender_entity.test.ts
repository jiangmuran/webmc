import { describe, it, expect } from 'vitest';
import { nextPos, shouldBreak } from './eye_of_ender_entity';

describe('eye of ender entity', () => {
  it('rises early', () => {
    const p = nextPos({ x: 0, y: 0, z: 0 }, { x: 100, y: 0, z: 0 }, 0);
    expect(p.y).toBeGreaterThan(0);
  });

  it('heads to target on x', () => {
    const p = nextPos({ x: 0, y: 0, z: 0 }, { x: 100, y: 0, z: 0 }, 20);
    expect(p.x).toBeGreaterThan(0);
  });

  it('falls late', () => {
    const p = nextPos({ x: 0, y: 50, z: 0 }, { x: 100, y: 0, z: 0 }, 70);
    expect(p.y).toBeLessThan(50);
  });

  it('break rng threshold', () => {
    expect(shouldBreak(() => 0)).toBe(true);
    expect(shouldBreak(() => 0.99)).toBe(false);
  });
});
