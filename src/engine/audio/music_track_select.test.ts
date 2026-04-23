import { describe, it, expect } from 'vitest';
import { poolKey, pickTrack } from './music_track_select';

describe('music track select', () => {
  it('combat wins', () => {
    expect(
      poolKey({ dimension: 'overworld', biomeTag: 'normal', isNight: false, inCombat: true }),
    ).toBe('combat');
  });

  it('nether pool', () => {
    expect(
      poolKey({ dimension: 'nether', biomeTag: 'normal', isNight: false, inCombat: false }),
    ).toBe('nether');
  });

  it('overworld night', () => {
    expect(
      poolKey({ dimension: 'overworld', biomeTag: 'normal', isNight: true, inCombat: false }),
    ).toBe('overworld_night');
  });

  it('cave biome picks cave pool', () => {
    expect(
      poolKey({ dimension: 'overworld', biomeTag: 'cave', isNight: false, inCombat: false }),
    ).toBe('overworld_cave');
  });

  it('pickTrack returns an id', () => {
    const id = pickTrack(
      { dimension: 'overworld', biomeTag: 'normal', isNight: false, inCombat: false },
      () => 0.5,
    );
    expect(typeof id).toBe('string');
    expect(id).not.toBe('silent');
  });
});
