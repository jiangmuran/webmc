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
  it('has 15 music discs', () => {
    expect(Object.keys(MUSIC_DISCS).length).toBe(15);
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
    insertDisc(j, 'five'); // 36s
    let finished = false;
    for (let i = 0; i < 100; i++) {
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
