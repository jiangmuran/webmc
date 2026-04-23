import { describe, it, expect } from 'vitest';
import { teleportOffset, onInteract, isGravity, MAX_TELEPORT_DISTANCE } from './dragon_egg_teleport';

describe('dragon egg teleport', () => {
  it('offset within range', () => {
    for (let i = 0; i < 10; i++) {
      const o = teleportOffset(() => Math.random());
      expect(Math.abs(o.dx)).toBeLessThanOrEqual(MAX_TELEPORT_DISTANCE);
      expect(Math.abs(o.dz)).toBeLessThanOrEqual(MAX_TELEPORT_DISTANCE);
    }
  });

  it('click teleports', () => {
    expect(onInteract('click')).toBe('teleport');
  });

  it('gravity enabled', () => {
    expect(isGravity()).toBe(true);
  });
});
