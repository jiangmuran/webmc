import { describe, it, expect } from 'vitest';
import { placementsPerChunk, ambientSoundId } from './warped_forest_flora';

describe('warped forest flora', () => {
  it('warped returns warped blocks', () => {
    expect(
      placementsPerChunk({ isWarpedBiome: true, isCrimsonBiome: false, rng: () => 0.5 }),
    ).toContain('warped_nylium');
  });

  it('crimson returns crimson blocks', () => {
    expect(
      placementsPerChunk({ isWarpedBiome: false, isCrimsonBiome: true, rng: () => 0.5 }),
    ).toContain('crimson_nylium');
  });

  it('plains empty', () => {
    expect(
      placementsPerChunk({ isWarpedBiome: false, isCrimsonBiome: false, rng: () => 0.5 }),
    ).toEqual([]);
  });

  it('ambient id', () => {
    expect(ambientSoundId({ isWarpedBiome: true, isCrimsonBiome: false, rng: () => 0 })).toContain(
      'warped',
    );
  });
});
