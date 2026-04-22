import { describe, it, expect } from 'vitest';
import { tryTeleport, TELEPORT_COOLDOWN_MS } from './shulker_teleport_escape';

describe('shulker teleport', () => {
  it('teleports when closed and cooldown passed', () => {
    const s = {
      pos: { x: 0, y: 64, z: 0 },
      shellOpenRatio: 0,
      color: 'purple',
      lastTeleportMs: -Infinity,
    };
    expect(tryTeleport(s, { nowMs: 1000, rand: () => 0.5, isValid: () => true })).toBe(true);
  });

  it('does not teleport when shell open', () => {
    const s = {
      pos: { x: 0, y: 64, z: 0 },
      shellOpenRatio: 0.5,
      color: 'purple',
      lastTeleportMs: -Infinity,
    };
    expect(tryTeleport(s, { nowMs: 1000, rand: () => 0, isValid: () => true })).toBe(false);
  });

  it('cooldown blocks', () => {
    const s = {
      pos: { x: 0, y: 64, z: 0 },
      shellOpenRatio: 0,
      color: 'purple',
      lastTeleportMs: 0,
    };
    expect(
      tryTeleport(s, { nowMs: TELEPORT_COOLDOWN_MS - 1, rand: () => 0, isValid: () => true }),
    ).toBe(false);
  });

  it('no valid landing fails', () => {
    const s = {
      pos: { x: 0, y: 64, z: 0 },
      shellOpenRatio: 0,
      color: 'purple',
      lastTeleportMs: -Infinity,
    };
    expect(tryTeleport(s, { nowMs: 0, rand: () => 0.5, isValid: () => false })).toBe(false);
  });
});
