import { describe, it, expect } from 'vitest';
import { reelVelocity, breakOnDistance, durabilityCostPerUse } from './fishing_rod_reel';

describe('fishing rod reel', () => {
  it('no entity zero vel', () => {
    expect(
      reelVelocity({
        hookedEntity: null,
        hookPosition: { x: 1, y: 0, z: 0 },
        playerPosition: { x: 0, y: 0, z: 0 },
      }),
    ).toEqual({ vx: 0, vy: 0, vz: 0 });
  });

  it('pulls toward player at 1/10 distance per tick (wiki)', () => {
    const v = reelVelocity({
      hookedEntity: 'cow',
      hookPosition: { x: 10, y: 0, z: 0 },
      playerPosition: { x: 0, y: 0, z: 0 },
    });
    // Wiki: speed = 0.1 × distance, direction toward player.
    // distance = 10, so vx = -0.1 × 10 = -1.0.
    expect(v.vx).toBeCloseTo(-1.0);
  });

  it('break at distance > 33', () => {
    expect(breakOnDistance(34)).toBe(true);
    expect(breakOnDistance(33)).toBe(false);
  });

  it('costs 1 durability', () => {
    expect(durabilityCostPerUse()).toBe(1);
  });
});
