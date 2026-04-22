import { describe, it, expect } from 'vitest';
import { canSpawnAt } from './spawn_rules';

const base = {
  blockLightAtSpawn: 0,
  skyLightAtSpawn: 0,
  belowIsSolid: true,
  aboveTwoAir: true,
  playerWithin24Blocks: false,
  playerWithin128Blocks: true,
  inWater: false,
};

describe('spawn rules', () => {
  it('hostile spawns in dark', () => {
    expect(canSpawnAt({ ...base, category: 'hostile' }).allowed).toBe(true);
  });

  it('hostile refuses bright areas', () => {
    expect(
      canSpawnAt({
        ...base,
        category: 'hostile',
        skyLightAtSpawn: 15,
      }).allowed,
    ).toBe(false);
  });

  it('passive needs skylight ≥ 9', () => {
    expect(
      canSpawnAt({
        ...base,
        category: 'passive',
        skyLightAtSpawn: 12,
      }).allowed,
    ).toBe(true);
    expect(
      canSpawnAt({
        ...base,
        category: 'passive',
        skyLightAtSpawn: 2,
      }).allowed,
    ).toBe(false);
  });

  it('water needs water', () => {
    expect(
      canSpawnAt({
        ...base,
        category: 'water',
        inWater: true,
      }).allowed,
    ).toBe(true);
    expect(
      canSpawnAt({
        ...base,
        category: 'water',
        inWater: false,
      }).allowed,
    ).toBe(false);
  });

  it('no player in 128 range → no spawn', () => {
    expect(
      canSpawnAt({
        ...base,
        category: 'hostile',
        playerWithin128Blocks: false,
      }).allowed,
    ).toBe(false);
  });

  it('player within 24 blocks → no spawn', () => {
    expect(
      canSpawnAt({
        ...base,
        category: 'hostile',
        playerWithin24Blocks: true,
      }).allowed,
    ).toBe(false);
  });
});
