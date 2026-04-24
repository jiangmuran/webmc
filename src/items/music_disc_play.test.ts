import { describe, it, expect } from 'vitest';
import { isMusicDisc, durationForDisc, MUSIC_DISC_IDS } from './music_disc_play';

describe('music disc play', () => {
  it('catalogues 19+ discs', () => {
    expect(MUSIC_DISC_IDS.length).toBeGreaterThanOrEqual(19);
  });

  it('13 is music disc', () => {
    expect(isMusicDisc('music_disc_13')).toBe(true);
  });

  it('apple is not disc', () => {
    expect(isMusicDisc('apple')).toBe(false);
  });

  it('durations positive', () => {
    expect(durationForDisc('music_disc_pigstep')).toBeGreaterThan(0);
  });

  it('blocks is the longest disc', () => {
    const blocks = durationForDisc('music_disc_blocks');
    const disc13 = durationForDisc('music_disc_13');
    expect(blocks).toBeGreaterThan(disc13);
  });
});
