import { describe, it, expect } from 'vitest';
import { shouldPlaceSpike, spikeHeight, isTallSpike, tallSpikeHeight } from './ice_spikes';

describe('ice spikes gen', () => {
  it('only in ice spikes biome', () => {
    expect(shouldPlaceSpike({ isIceSpikesBiome: false, rng: () => 0.0001 })).toBe(false);
  });

  it('places rarely in biome', () => {
    expect(shouldPlaceSpike({ isIceSpikesBiome: true, rng: () => 0.001 })).toBe(true);
    expect(shouldPlaceSpike({ isIceSpikesBiome: true, rng: () => 0.9 })).toBe(false);
  });

  it('normal height 7-11', () => {
    const h = spikeHeight({ isIceSpikesBiome: true, rng: () => 0.5 });
    expect(h).toBeGreaterThanOrEqual(7);
    expect(h).toBeLessThan(12);
  });

  it('tall spikes ultra rare', () => {
    expect(isTallSpike({ isIceSpikesBiome: true, rng: () => 0.001 })).toBe(true);
    expect(isTallSpike({ isIceSpikesBiome: true, rng: () => 0.5 })).toBe(false);
  });

  it('tall heights taller', () => {
    const h = tallSpikeHeight({ isIceSpikesBiome: true, rng: () => 0 });
    expect(h).toBeGreaterThanOrEqual(12);
  });
});
