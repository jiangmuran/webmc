import { describe, it, expect } from 'vitest';
import { comparatorSignal, canInsertDisc, ejectDisc } from './jukebox_redstone';

describe('jukebox redstone', () => {
  it('empty zero signal', () => {
    expect(comparatorSignal(null)).toBe(0);
  });

  it('disc 13 = 1', () => {
    expect(comparatorSignal('music_disc_13')).toBe(1);
  });

  it('disc 5 = 15', () => {
    expect(comparatorSignal('music_disc_5')).toBe(15);
  });

  it('1.21 discs: relic=14, precipice=13, creator=12 (wiki)', () => {
    expect(comparatorSignal('music_disc_relic')).toBe(14);
    expect(comparatorSignal('music_disc_precipice')).toBe(13);
    expect(comparatorSignal('music_disc_creator')).toBe(12);
    expect(comparatorSignal('music_disc_creator_music_box')).toBe(11);
  });

  it('insert only when empty', () => {
    expect(canInsertDisc(null)).toBe(true);
    expect(canInsertDisc('music_disc_cat')).toBe(false);
  });

  it('eject stops music', () => {
    expect(ejectDisc().stopsMusic).toBe(true);
  });
});
