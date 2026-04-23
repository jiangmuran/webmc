import { describe, it, expect } from 'vitest';
import { nearbyVillagers, nearbyRaiders, glowsRaidersFor, BELL_RADIUS } from './village_bell_alarm';

const ev = { centerX: 0, centerZ: 0, rungByPlayer: true };

describe('village bell alarm', () => {
  it('finds villagers in range', () => {
    const r = nearbyVillagers(ev, [
      { x: 5, z: 5, id: 'a' },
      { x: 100, z: 0, id: 'b' },
    ]);
    expect(r).toEqual(['a']);
  });

  it('raiders similar', () => {
    const r = nearbyRaiders(ev, [
      { x: 10, z: 10, id: 'r1' },
      { x: 1000, z: 0, id: 'r2' },
    ]);
    expect(r).toEqual(['r1']);
  });

  it('radius 32', () => {
    expect(BELL_RADIUS).toBe(32);
  });

  it('glow duration > 0', () => {
    expect(glowsRaidersFor()).toBeGreaterThan(0);
  });
});
