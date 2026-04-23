import { describe, it, expect } from 'vitest';
import { tick, isReady, variantForBiome, TADPOLE_GROW_TICKS } from './tadpole_growth';

describe('tadpole growth', () => {
  it('tick grows in water', () => {
    expect(tick({ ticksOld: 0, inWater: true, biomeAtGrowth: null }).ticksOld).toBe(1);
  });

  it('dry halts growth', () => {
    expect(tick({ ticksOld: 100, inWater: false, biomeAtGrowth: null }).ticksOld).toBe(100);
  });

  it('ready at threshold', () => {
    expect(isReady({ ticksOld: TADPOLE_GROW_TICKS, inWater: true, biomeAtGrowth: null })).toBe(
      true,
    );
  });

  it('jungle → warm', () => {
    expect(variantForBiome('jungle')).toBe('warm');
  });

  it('snowy → cold', () => {
    expect(variantForBiome('snowy_plains')).toBe('cold');
  });

  it('plains → temperate', () => {
    expect(variantForBiome('plains')).toBe('temperate');
  });
});
