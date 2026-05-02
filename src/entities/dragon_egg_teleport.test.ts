import { describe, it, expect } from 'vitest';
import {
  teleportOffset,
  onInteract,
  isGravity,
  MAX_TELEPORT_DISTANCE,
} from './dragon_egg_teleport';

describe('dragon egg teleport', () => {
  it('offset within range', () => {
    for (let i = 0; i < 10; i++) {
      const o = teleportOffset(() => Math.random());
      expect(Math.abs(o.dx)).toBeLessThanOrEqual(MAX_TELEPORT_DISTANCE);
      expect(Math.abs(o.dz)).toBeLessThanOrEqual(MAX_TELEPORT_DISTANCE);
    }
  });

  it('+MAX is reachable on each horizontal axis (wiki)', () => {
    // Wiki (minecraft.wiki/w/Dragon_Egg): "up to 15 blocks horizontally"
    // — old `floor(rng() * 2*MAX) - MAX` capped reach at +MAX-1.
    // rng() = 0.999 should now hit +MAX on each axis.
    const o = teleportOffset(() => 0.999);
    expect(o.dx).toBe(MAX_TELEPORT_DISTANCE);
    expect(o.dz).toBe(MAX_TELEPORT_DISTANCE);
  });

  it('click teleports', () => {
    expect(onInteract('click')).toBe('teleport');
  });

  it('gravity enabled', () => {
    expect(isGravity()).toBe(true);
  });
});
