import { describe, it, expect } from 'vitest';
import { shouldTeleport, afterTeleport, tick, PORTAL_ACTIVATION_TICKS } from './portal_cooldown';

describe('portal cooldown', () => {
  it('cooldown blocks', () => {
    expect(
      shouldTeleport({
        entityType: 'player',
        cooldownTicksRemaining: 5,
        insidePortal: true,
        ticksInsidePortal: 200,
      }),
    ).toBe(false);
  });

  it('player needs 4s inside', () => {
    expect(
      shouldTeleport({
        entityType: 'player',
        cooldownTicksRemaining: 0,
        insidePortal: true,
        ticksInsidePortal: 40,
      }),
    ).toBe(false);
    expect(
      shouldTeleport({
        entityType: 'player',
        cooldownTicksRemaining: 0,
        insidePortal: true,
        ticksInsidePortal: PORTAL_ACTIVATION_TICKS,
      }),
    ).toBe(true);
  });

  it('mob teleports immediately', () => {
    expect(
      shouldTeleport({
        entityType: 'mob',
        cooldownTicksRemaining: 0,
        insidePortal: true,
        ticksInsidePortal: 0,
      }),
    ).toBe(true);
  });

  it('after teleport sets cooldown', () => {
    const r = afterTeleport({
      entityType: 'player',
      cooldownTicksRemaining: 0,
      insidePortal: true,
      ticksInsidePortal: 80,
    });
    expect(r.cooldownTicksRemaining).toBeGreaterThan(0);
  });

  it('player cooldown is 200 ticks (wiki: 10 seconds)', () => {
    // Wiki (minecraft.wiki/w/Nether_Portal): "10 seconds (200 ticks)"
    // for players. Old constant 10 was 20× too short — bouncing back
    // through the destination portal at the next tick.
    const r = afterTeleport({
      entityType: 'player',
      cooldownTicksRemaining: 0,
      insidePortal: true,
      ticksInsidePortal: 80,
    });
    expect(r.cooldownTicksRemaining).toBe(200);
  });

  it('tick decrements cooldown', () => {
    const r = tick({
      entityType: 'player',
      cooldownTicksRemaining: 5,
      insidePortal: false,
      ticksInsidePortal: 0,
    });
    expect(r.cooldownTicksRemaining).toBe(4);
  });
});
