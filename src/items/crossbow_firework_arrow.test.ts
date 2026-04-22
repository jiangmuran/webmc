import { describe, it, expect } from 'vitest';
import {
  fireworkIgnoresPiercing,
  isFireworkAmmo,
  launchFireworks,
  type CrossbowFirework,
} from './crossbow_firework_arrow';

const ROCKET: CrossbowFirework = {
  item: 'webmc:firework_rocket',
  stars: [],
  flightDuration: 2,
};

describe('crossbow firework', () => {
  it('detects firework ammo', () => {
    expect(isFireworkAmmo(ROCKET)).toBe(true);
    expect(isFireworkAmmo({ item: 'webmc:arrow' })).toBe(false);
  });

  it('single launch without multishot', () => {
    const r = launchFireworks({
      rocket: ROCKET,
      multishotLevel: 0,
      baseDir: { x: 1, y: 0, z: 0 },
      baseVelocity: 20,
    });
    expect(r.projectiles.length).toBe(1);
  });

  it('multishot launches 3', () => {
    const r = launchFireworks({
      rocket: ROCKET,
      multishotLevel: 1,
      baseDir: { x: 1, y: 0, z: 0 },
      baseVelocity: 20,
    });
    expect(r.projectiles.length).toBe(3);
  });

  it('detonation scales with flight duration', () => {
    const d1 = launchFireworks({
      rocket: { ...ROCKET, flightDuration: 1 },
      multishotLevel: 0,
      baseDir: { x: 1, y: 0, z: 0 },
      baseVelocity: 20,
    });
    const d3 = launchFireworks({
      rocket: { ...ROCKET, flightDuration: 3 },
      multishotLevel: 0,
      baseDir: { x: 1, y: 0, z: 0 },
      baseVelocity: 20,
    });
    expect(d3.projectiles[0]?.detonationSec ?? 0).toBeGreaterThan(
      d1.projectiles[0]?.detonationSec ?? 0,
    );
  });

  it('piercing cannot stop firework', () => {
    expect(fireworkIgnoresPiercing()).toBe(true);
  });
});
