import { describe, it, expect } from 'vitest';
import { makeShulkerTeleport, tickShulkerTeleport } from './shulker_teleport';

describe('shulker teleport', () => {
  it('teleports when hurt below half HP', () => {
    const s = makeShulkerTeleport({ x: 0, y: 0, z: 0 });
    s.hp = 10;
    const r = tickShulkerTeleport(s, {
      candidateWalls: [{ x: 5, y: 0, z: 0 }],
      dtSec: 0.1,
    });
    expect(r.teleportTo?.x).toBe(5);
  });

  it('refuses when cooldown active', () => {
    const s = makeShulkerTeleport({ x: 0, y: 0, z: 0 });
    s.hp = 10;
    tickShulkerTeleport(s, {
      candidateWalls: [{ x: 5, y: 0, z: 0 }],
      dtSec: 0.1,
    });
    const r = tickShulkerTeleport(s, {
      candidateWalls: [{ x: 7, y: 0, z: 0 }],
      dtSec: 0.1,
    });
    expect(r.teleportTo).toBeNull();
  });

  it('ignores walls outside the 17x17x17 cube (axis distance > 8) (wiki)', () => {
    const s = makeShulkerTeleport({ x: 0, y: 0, z: 0 });
    s.hp = 10;
    // Far on one axis.
    expect(
      tickShulkerTeleport(s, {
        candidateWalls: [{ x: 100, y: 0, z: 0 }],
        dtSec: 0.1,
      }).teleportTo,
    ).toBeNull();
    // Just outside the 8-axis cube boundary.
    expect(
      tickShulkerTeleport(s, {
        candidateWalls: [{ x: 9, y: 0, z: 0 }],
        dtSec: 0.1,
      }).teleportTo,
    ).toBeNull();
  });

  it('accepts walls at the 17x17x17 cube boundary (axis distance ≤ 8)', () => {
    const s = makeShulkerTeleport({ x: 0, y: 0, z: 0 });
    s.hp = 10;
    const r = tickShulkerTeleport(s, {
      candidateWalls: [{ x: 8, y: 0, z: 0 }],
      dtSec: 0.1,
    });
    expect(r.teleportTo?.x).toBe(8);
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
