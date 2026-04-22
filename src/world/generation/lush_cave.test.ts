import { describe, it, expect } from 'vitest';
import {
  makeGlowBerry,
  pickGlowBerry,
  planLushCave,
  SPORE_BLOSSOM_RADIUS,
  tickGlowBerry,
} from './lush_cave';

describe('lush cave', () => {
  it('moss coverage is > 50%', () => {
    const l = planLushCave({ rng: () => 0.5, caveVolume: 2000 });
    expect(l.floorMossCoverage).toBeGreaterThan(0.5);
  });

  it('azalea clusters scale with cave size', () => {
    const small = planLushCave({ rng: () => 0.5, caveVolume: 500 });
    const big = planLushCave({ rng: () => 0.5, caveVolume: 10000 });
    expect(big.azaleaClusters).toBeGreaterThanOrEqual(small.azaleaClusters);
  });

  it('spore blossom radius is 14', () => {
    expect(SPORE_BLOSSOM_RADIUS).toBe(14);
  });
});

describe('glow berry vine', () => {
  it('grows downward on low roll', () => {
    const v = makeGlowBerry();
    expect(tickGlowBerry(v, { belowIsReplaceable: true, randomRoll: 0.05 })).toBe('grew_down');
    expect(v.age).toBe(1);
  });

  it('blooms into berries', () => {
    const v = makeGlowBerry();
    tickGlowBerry(v, { belowIsReplaceable: false, randomRoll: 0.18 });
    expect(v.hasBerries).toBe(true);
  });

  it('picking berries returns 1-3', () => {
    const v = makeGlowBerry();
    v.hasBerries = true;
    const count = pickGlowBerry(v);
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(3);
    expect(v.hasBerries).toBe(false);
  });

  it('no change when inert', () => {
    const v = makeGlowBerry();
    const r = tickGlowBerry(v, { belowIsReplaceable: true, randomRoll: 0.9 });
    expect(r).toBe('none');
  });
});
