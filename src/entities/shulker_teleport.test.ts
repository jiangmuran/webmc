import { describe, it, expect } from 'vitest';
import { makeShulkerTeleport, tickShulkerTeleport } from './shulker_teleport';

describe('shulker teleport', () => {
  it('teleports when hurt below half HP', () => {
    const s = makeShulkerTeleport({ x: 0, y: 0, z: 0 });
    s.hp = 10;
    const r = tickShulkerTeleport(s, {
      candidateWalls: [{ x: 10, y: 0, z: 0 }],
      dtSec: 0.1,
    });
    expect(r.teleportTo?.x).toBe(10);
  });

  it('refuses when cooldown active', () => {
    const s = makeShulkerTeleport({ x: 0, y: 0, z: 0 });
    s.hp = 10;
    tickShulkerTeleport(s, {
      candidateWalls: [{ x: 10, y: 0, z: 0 }],
      dtSec: 0.1,
    });
    const r = tickShulkerTeleport(s, {
      candidateWalls: [{ x: 20, y: 0, z: 0 }],
      dtSec: 0.1,
    });
    expect(r.teleportTo).toBeNull();
  });

  it('ignores walls > 17 blocks away', () => {
    const s = makeShulkerTeleport({ x: 0, y: 0, z: 0 });
    s.hp = 10;
    const r = tickShulkerTeleport(s, {
      candidateWalls: [{ x: 100, y: 0, z: 0 }],
      dtSec: 0.1,
    });
    expect(r.teleportTo).toBeNull();
  });

  it("full-hp shulker doesn't teleport", () => {
    const s = makeShulkerTeleport({ x: 0, y: 0, z: 0 });
    const r = tickShulkerTeleport(s, {
      candidateWalls: [{ x: 5, y: 0, z: 0 }],
      dtSec: 0.1,
    });
    expect(r.teleportTo).toBeNull();
  });
});
