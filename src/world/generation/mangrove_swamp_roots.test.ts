import { describe, it, expect } from 'vitest';
import { placesPropagule, rootsBelowWaterOK, mudIsGroundCover } from './mangrove_swamp_roots';

describe('mangrove swamp roots', () => {
  it('mangrove drops propagule sometimes', () => {
    expect(placesPropagule({ isMangroveBiome: true, aboveY: 64, isMud: true }, () => 0)).toBe(true);
  });

  it('wrong biome no propagule', () => {
    expect(placesPropagule({ isMangroveBiome: false, aboveY: 64, isMud: true }, () => 0)).toBe(
      false,
    );
  });

  it('roots below threshold', () => {
    expect(rootsBelowWaterOK({ isMangroveBiome: true, aboveY: 30, isMud: true })).toBe(true);
  });

  it('mud is ground cover', () => {
    expect(mudIsGroundCover({ isMangroveBiome: true, aboveY: 64, isMud: true })).toBe(true);
  });
});
