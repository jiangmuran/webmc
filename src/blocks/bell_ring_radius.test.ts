import { describe, it, expect } from 'vitest';
import { entitiesHearing, raidersRevealed, GLOW_TICKS } from './bell_ring_radius';

describe('bell ring radius', () => {
  const ring = { bellX: 0, bellY: 64, bellZ: 0 };

  it('close entity hears', () => {
    expect(entitiesHearing(ring, [{ id: 'a', x: 10, y: 64, z: 0 }])).toEqual(['a']);
  });

  it('far entity silent', () => {
    expect(entitiesHearing(ring, [{ id: 'a', x: 100, y: 64, z: 0 }])).toEqual([]);
  });

  it('raider within radius revealed', () => {
    expect(raidersRevealed(ring, [{ id: 'r', x: 20, y: 64, z: 0 }])).toEqual(['r']);
  });

  it('raider outside radius hidden', () => {
    expect(raidersRevealed(ring, [{ id: 'r', x: 40, y: 64, z: 0 }])).toEqual([]);
  });

  it('glow ticks 60', () => {
    expect(GLOW_TICKS).toBe(60);
  });
});
