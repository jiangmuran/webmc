import { describe, it, expect } from 'vitest';
import { isDancing, stopDanceOnEject, PARROT_DANCE_RADIUS } from './parrot_dance_jukebox';

describe('parrot dance', () => {
  it('no jukebox no dance', () => {
    expect(
      isDancing({ jukeboxPos: null, jukeboxPlaying: false, parrotPos: { x: 0, y: 0, z: 0 } }),
    ).toBe(false);
  });

  it('not playing no dance', () => {
    expect(
      isDancing({
        jukeboxPos: { x: 0, y: 0, z: 0 },
        jukeboxPlaying: false,
        parrotPos: { x: 1, y: 0, z: 0 },
      }),
    ).toBe(false);
  });

  it('close + playing dances', () => {
    expect(
      isDancing({
        jukeboxPos: { x: 0, y: 0, z: 0 },
        jukeboxPlaying: true,
        parrotPos: { x: 1, y: 0, z: 0 },
      }),
    ).toBe(true);
  });

  it('out of radius no dance', () => {
    expect(
      isDancing({
        jukeboxPos: { x: 0, y: 0, z: 0 },
        jukeboxPlaying: true,
        parrotPos: { x: PARROT_DANCE_RADIUS + 1, y: 0, z: 0 },
      }),
    ).toBe(false);
  });

  it('eject stops dance', () => {
    expect(stopDanceOnEject()).toBe(true);
  });
});
