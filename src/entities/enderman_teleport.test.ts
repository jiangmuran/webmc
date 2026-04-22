import { describe, it, expect } from 'vitest';
import { tryTeleport, triggersTeleport, TP_RADIUS } from './enderman_teleport';

describe('enderman teleport', () => {
  it('finds valid landing', () => {
    const r = tryTeleport({
      from: { x: 0, y: 64, z: 0 },
      rand: () => 0.5,
      validLanding: () => true,
    });
    expect(r).not.toBeNull();
  });

  it('returns null when none valid', () => {
    const r = tryTeleport({
      from: { x: 0, y: 64, z: 0 },
      rand: () => 0.5,
      validLanding: () => false,
      maxAttempts: 5,
    });
    expect(r).toBeNull();
  });

  it('within radius', () => {
    const r = tryTeleport({
      from: { x: 0, y: 0, z: 0 },
      rand: () => 0.99,
      validLanding: () => true,
    });
    if (r) {
      expect(Math.abs(r.x)).toBeLessThanOrEqual(TP_RADIUS);
      expect(Math.abs(r.y)).toBeLessThanOrEqual(TP_RADIUS);
      expect(Math.abs(r.z)).toBeLessThanOrEqual(TP_RADIUS);
    }
  });

  it('triggers', () => {
    expect(triggersTeleport(true, false, false)).toBe(true);
    expect(triggersTeleport(false, true, false)).toBe(true);
    expect(triggersTeleport(false, false, true)).toBe(true);
    expect(triggersTeleport(false, false, false)).toBe(false);
  });
});
