import { describe, it, expect } from 'vitest';
import {
  MUSIC_DISCS,
  comparatorOutput,
  ejectDisc,
  insertDisc,
  makeJukebox,
  tickJukebox,
} from './jukebox';

describe('jukebox', () => {
  it('has all canonical discs (13 + 14 newer + relic)', () => {
    // Original 15 comparator-distinct discs (13 → cat → … → 5)
    // plus the Relic addition that reuses signal 14.
    expect(Object.keys(MUSIC_DISCS).length).toBeGreaterThanOrEqual(15);
    expect(MUSIC_DISCS.thirteen?.comparatorValue).toBe(1);
    expect(MUSIC_DISCS.five?.comparatorValue).toBe(15);
  });

  it('insert + eject cycles the disc', () => {
    const j = makeJukebox();
    expect(insertDisc(j, 'cat')).toBe(true);
    expect(j.disc).toBe('cat');
    expect(ejectDisc(j)).toBe('cat');
    expect(j.disc).toBeNull();
  });

  it('refuses to overwrite a loaded disc', () => {
    const j = makeJukebox();
    insertDisc(j, 'cat');
    expect(insertDisc(j, 'blocks')).toBe(false);
    expect(j.disc).toBe('cat');
  });

  it('tickJukebox advances playback and signals done', () => {
    const j = makeJukebox();
    insertDisc(j, 'five'); // 178s per minecraft.wiki/w/Music_Disc_5
    let finished = false;
    for (let i = 0; i < 200; i++) {
      if (tickJukebox(j, 1)) finished = true;
    }
    expect(finished).toBe(true);
  });

  it('comparatorOutput reflects disc ordinal', () => {
    const j = makeJukebox();
    expect(comparatorOutput(j)).toBe(0);
    insertDisc(j, 'five');
    expect(comparatorOutput(j)).toBe(15);
  });
});
