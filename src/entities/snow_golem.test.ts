import { describe, it, expect } from 'vitest';
import { makeSnowGolem, tickSnowGolem } from './snow_golem';

describe('snow golem', () => {
  it('shoots at nearby hostiles with cooldown', () => {
    const g = makeSnowGolem();
    const r = tickSnowGolem(g, {
      dtSec: 0.1,
      nearbyHostileTargetId: 42,
      inHotBiome: false,
      inWater: false,
      onSnowableSurface: false,
    });
    expect(r.fireSnowballAt).toBe(42);
    const r2 = tickSnowGolem(g, {
      dtSec: 0.1,
      nearbyHostileTargetId: 42,
      inHotBiome: false,
      inWater: false,
      onSnowableSurface: false,
    });
    expect(r2.fireSnowballAt).toBeNull();
  });

  it('leaves snow trail on snowable surface', () => {
    const g = makeSnowGolem();
    const r = tickSnowGolem(g, {
      dtSec: 0.1,
      nearbyHostileTargetId: null,
      inHotBiome: false,
      inWater: false,
      onSnowableSurface: true,
    });
    expect(r.placeSnowLayer).toBe(true);
  });

  it('melts in hot biome', () => {
    const g = makeSnowGolem();
    for (let i = 0; i < 100; i++) {
      tickSnowGolem(g, {
        dtSec: 0.1,
        nearbyHostileTargetId: null,
        inHotBiome: true,
        inWater: false,
        onSnowableSurface: false,
      });
    }
    expect(g.hp).toBeLessThanOrEqual(0);
  });

  it('melts in water', () => {
    const g = makeSnowGolem();
    for (let i = 0; i < 100; i++) {
      tickSnowGolem(g, {
        dtSec: 0.1,
        nearbyHostileTargetId: null,
        inHotBiome: false,
        inWater: true,
        onSnowableSurface: false,
      });
    }
    expect(g.hp).toBeLessThanOrEqual(0);
  });
});
