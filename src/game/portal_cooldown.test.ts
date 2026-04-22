import { describe, it, expect } from 'vitest';
import {
  canTeleport,
  makeCooldown,
  PORTAL_COOLDOWN_TICKS,
  startCooldown,
  tickCooldown,
} from './portal_cooldown';

describe('portal cooldown', () => {
  it('starts at 0 ticks', () => {
    expect(makeCooldown().ticksRemaining).toBe(0);
  });

  it('starting loads the right ticks', () => {
    const s = makeCooldown();
    startCooldown(s, 'nether_portal');
    expect(s.ticksRemaining).toBe(300);
  });

  it('end gateway is shorter', () => {
    expect(PORTAL_COOLDOWN_TICKS.end_gateway).toBe(40);
  });

  it('tick reduces counter', () => {
    const s = makeCooldown();
    startCooldown(s, 'end_gateway');
    tickCooldown(s, 10);
    expect(s.ticksRemaining).toBe(30);
  });

  it('clearing reason at zero', () => {
    const s = makeCooldown();
    startCooldown(s, 'nether_portal');
    tickCooldown(s, 500);
    expect(s.ticksRemaining).toBe(0);
    expect(s.reason).toBeNull();
  });

  it('survival player must wait', () => {
    const s = makeCooldown();
    startCooldown(s, 'nether_portal');
    expect(canTeleport(s, false)).toBe(false);
  });

  it('creative bypasses cooldown', () => {
    const s = makeCooldown();
    startCooldown(s, 'nether_portal');
    expect(canTeleport(s, true)).toBe(true);
  });
});
