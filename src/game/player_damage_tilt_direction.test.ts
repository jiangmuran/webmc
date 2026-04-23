import { describe, it, expect } from 'vitest';
import { damageTiltAngle } from './player_damage_tilt_direction';

describe('player damage tilt direction', () => {
  it('attacker east, facing east → 0', () => {
    const a = damageTiltAngle({
      attackerX: 5,
      attackerZ: 0,
      playerX: 0,
      playerZ: 0,
      playerYaw: 0,
    });
    expect(a).toBeCloseTo(0);
  });

  it('attacker behind when facing east → ±pi', () => {
    const a = damageTiltAngle({
      attackerX: -5,
      attackerZ: 0,
      playerX: 0,
      playerZ: 0,
      playerYaw: 0,
    });
    expect(Math.abs(a)).toBeCloseTo(Math.PI);
  });

  it('angle is within -pi..pi', () => {
    const a = damageTiltAngle({
      attackerX: 1,
      attackerZ: -1,
      playerX: 0,
      playerZ: 0,
      playerYaw: Math.PI,
    });
    expect(a).toBeGreaterThanOrEqual(-Math.PI);
    expect(a).toBeLessThanOrEqual(Math.PI);
  });
});
