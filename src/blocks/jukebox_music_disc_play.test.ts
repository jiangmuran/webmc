import { describe, it, expect } from 'vitest';
import {
  shouldStop,
  comparatorOutputForDisc,
  DISC_DURATION_TICKS,
} from './jukebox_music_disc_play';

describe('jukebox music disc play', () => {
  it('stops after duration', () => {
    expect(
      shouldStop(
        { disc: 'music_disc_13', playingSinceTick: 0 },
        DISC_DURATION_TICKS['music_disc_13'] ?? 0,
      ),
    ).toBe(true);
  });

  it('no disc no stop', () => {
    expect(shouldStop({ playingSinceTick: 0 }, 10000)).toBe(false);
  });

  it('comparator differs for different discs', () => {
    expect(comparatorOutputForDisc({ disc: 'music_disc_13', playingSinceTick: 0 })).toBe(1);
    expect(comparatorOutputForDisc({ disc: 'music_disc_cat', playingSinceTick: 0 })).toBe(2);
  });
});
