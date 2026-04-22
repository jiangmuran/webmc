import { describe, it, expect } from 'vitest';
import {
  orbInGravitateRange,
  orbInPickupRange,
  applyMending,
  GRAVITATE_RADIUS,
  MENDING_RATIO,
} from './xp_orb_pickup';

function orb(
  x: number,
  y: number,
  z: number,
): { id: number; x: number; y: number; z: number; value: number; lifetimeTicks: number } {
  return { id: 1, x, y, z, value: 5, lifetimeTicks: 0 };
}

describe('xp orb pickup', () => {
  it('gravitate within radius', () => {
    expect(orbInGravitateRange(orb(5, 0, 0), { player: { x: 0, y: 0, z: 0 }, nowTick: 0 })).toBe(
      true,
    );
    expect(
      orbInGravitateRange(orb(GRAVITATE_RADIUS + 1, 0, 0), {
        player: { x: 0, y: 0, z: 0 },
        nowTick: 0,
      }),
    ).toBe(false);
  });

  it('pickup tighter', () => {
    expect(orbInPickupRange(orb(2, 0, 0), { player: { x: 0, y: 0, z: 0 }, nowTick: 0 })).toBe(
      false,
    );
  });

  it('mending repairs by ratio', () => {
    const r = applyMending({ orbValue: 3, itemDamage: 100 });
    expect(r.durabilityRepaired).toBe(3 * MENDING_RATIO);
    expect(r.xpConsumed).toBe(3);
  });

  it('full-durability item skips mending', () => {
    const r = applyMending({ orbValue: 3, itemDamage: 0 });
    expect(r.durabilityRepaired).toBe(0);
    expect(r.xpRemaining).toBe(3);
  });

  it('overfill leaves no remainder', () => {
    const r = applyMending({ orbValue: 100, itemDamage: 10 });
    expect(r.durabilityRepaired).toBe(10);
    expect(r.xpRemaining).toBe(95);
  });
});
