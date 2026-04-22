import { describe, it, expect } from 'vitest';
import { makeBell, raidersToReveal, ringBell, tickBell } from './bell';

describe('bell', () => {
  it('rings with cooldown', () => {
    const b = makeBell();
    expect(ringBell(b)).toBe(true);
    expect(ringBell(b)).toBe(false); // already ringing
    tickBell(b, 3);
    expect(ringBell(b)).toBe(true);
  });

  it('tracks facing', () => {
    const b = makeBell();
    ringBell(b, 'east');
    expect(b.facing).toBe('east');
  });

  it('reveals raiders within range', () => {
    const out = raidersToReveal({ x: 0, y: 64, z: 0 }, [
      { id: 1, position: { x: 10, y: 64, z: 0 } },
      { id: 2, position: { x: 60, y: 64, z: 0 } },
    ]);
    expect(out.map((r) => r.entityId)).toEqual([1]);
  });

  it('reveal has 3s duration', () => {
    const out = raidersToReveal({ x: 0, y: 0, z: 0 }, [{ id: 1, position: { x: 0, y: 0, z: 0 } }]);
    expect(out[0]?.revealSec).toBe(3);
  });
});
