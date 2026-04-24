import { describe, it, expect } from 'vitest';
import {
  canHoldSculk,
  spawnsSculkShrieker,
  wardenSpawnEligible,
  lootTier,
  WARDEN_SPAWN_ATTEMPT_Y,
} from './deep_dark_structures';

describe('deep dark structures', () => {
  it('sculk below y=0', () => {
    expect(canHoldSculk(-20)).toBe(true);
  });

  it('no sculk above', () => {
    expect(canHoldSculk(50)).toBe(false);
  });

  it('shrieker in ancient city below threshold', () => {
    expect(spawnsSculkShrieker({ y: -30, inAncientCity: true, rng: () => 0.001 })).toBe(true);
  });

  it('surface no shrieker', () => {
    expect(spawnsSculkShrieker({ y: 50, inAncientCity: true, rng: () => 0.001 })).toBe(false);
  });

  it('warden eligible deep', () => {
    expect(wardenSpawnEligible(WARDEN_SPAWN_ATTEMPT_Y)).toBe(true);
  });

  it('warden not eligible shallow', () => {
    expect(wardenSpawnEligible(0)).toBe(false);
  });

  it('lucky loot → music disc', () => {
    expect(lootTier({ y: -30, inAncientCity: true, rng: () => 0.01 })).toBe('music_disc_5');
  });

  it('no ancient city regular', () => {
    expect(lootTier({ y: 0, inAncientCity: false, rng: () => 0.01 })).toBe('regular');
  });
});
