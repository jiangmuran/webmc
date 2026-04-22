import { describe, it, expect } from 'vitest';
import {
  displayName,
  makeSpectator,
  teleportSpectator,
  unbindCamera,
  unbindOnTargetDeath,
} from './spectator_teleport';

describe('spectator', () => {
  it('teleport binds camera', () => {
    const s = makeSpectator('p1', { x: 0, y: 0, z: 0 });
    const r = teleportSpectator(s, {
      targetEntityId: 42,
      targetPos: { x: 100, y: 64, z: 100 },
    });
    expect(r.accepted).toBe(true);
    expect(s.boundToEntityId).toBe(42);
    expect(s.position).toEqual({ x: 100, y: 64, z: 100 });
  });

  it('null target pos = no teleport', () => {
    const s = makeSpectator('p1', { x: 0, y: 0, z: 0 });
    const r = teleportSpectator(s, { targetEntityId: 42, targetPos: null });
    expect(r.accepted).toBe(false);
  });

  it('unbind clears target', () => {
    const s = makeSpectator('p1', { x: 0, y: 0, z: 0 });
    s.boundToEntityId = 42;
    unbindCamera(s);
    expect(s.boundToEntityId).toBeNull();
  });

  it('target death snaps back', () => {
    const s = makeSpectator('p1', { x: 0, y: 0, z: 0 });
    s.boundToEntityId = 42;
    unbindOnTargetDeath(s, { lastKnownPos: { x: 10, y: 10, z: 10 } });
    expect(s.position).toEqual({ x: 10, y: 10, z: 10 });
    expect(s.cameraUnboundFromDeath).toBe(true);
  });

  it('display name italic', () => {
    expect(displayName('alice')).toContain('§o');
  });
});
