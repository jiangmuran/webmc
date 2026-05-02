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

  it('comparator reads per-disc value while playing (wiki)', () => {
    // Wiki: "13" → 1, "5" → 15. Disc-specific signal, not flat 15.
    const j13 = makeJukebox();
    insert(j13, 'webmc:music_disc_13', 0);
    expect(comparatorOutput(j13, 100)).toBe(1);
    const j5 = makeJukebox();
    insert(j5, 'webmc:music_disc_5', 0);
    expect(comparatorOutput(j5, 100)).toBe(15);
  });

  it('playback expires', () => {
    const j = makeJukebox();
    insert(j, 'webmc:music_disc_mellohi', 0);
    expect(isPlaying(j, 200_000)).toBe(false);
  });
});
