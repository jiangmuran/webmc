import { describe, it, expect } from 'vitest';
import { makeJukebox, insert, eject, isPlaying, comparatorOutput } from './jukebox_play';

describe('jukebox', () => {
  it('insert starts playback', () => {
    const j = makeJukebox();
    expect(insert(j, 'webmc:music_disc_cat', 0)).toBe(true);
    expect(isPlaying(j, 100)).toBe(true);
  });

  it('cannot insert twice', () => {
    const j = makeJukebox();
    insert(j, 'webmc:music_disc_cat', 0);
    expect(insert(j, 'webmc:music_disc_13', 0)).toBe(false);
  });

  it('eject returns disc', () => {
    const j = makeJukebox();
    insert(j, 'webmc:music_disc_cat', 0);
    expect(eject(j)).toBe('webmc:music_disc_cat');
    expect(j.disc).toBeNull();
  });

  it('comparator 15 while playing', () => {
    const j = makeJukebox();
    insert(j, 'webmc:music_disc_13', 0);
    expect(comparatorOutput(j, 100)).toBe(15);
  });

  it('playback expires', () => {
    const j = makeJukebox();
    insert(j, 'webmc:music_disc_mellohi', 0);
    expect(isPlaying(j, 200_000)).toBe(false);
  });
});
