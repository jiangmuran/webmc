import { describe, it, expect } from 'vitest';
import {
  shouldTeleport,
  pickTeleportOffset,
  TELEPORT_RADIUS,
} from './enderman_teleport_hit_escape';

describe('enderman teleport hit escape', () => {
  it('water escapes sometimes', () => {
    expect(shouldTeleport({ tookDamage: false, inWater: true, inRain: false }, () => 0)).toBe(true);
  });

  it('idle stays', () => {
    expect(shouldTeleport({ tookDamage: false, inWater: false, inRain: false }, () => 0)).toBe(
      false,
    );
  });

  it('damage rarely teleports', () => {
    expect(shouldTeleport({ tookDamage: true, inWater: false, inRain: false }, () => 0.99)).toBe(
      false,
    );
    expect(shouldTeleport({ tookDamage: true, inWater: false, inRain: false }, () => 0)).toBe(true);
  });

  it('offset in range', () => {
    const o = pickTeleportOffset(() => 0.5);
    expect(Math.abs(o.dx)).toBeLessThanOrEqual(TELEPORT_RADIUS);
  });
});
